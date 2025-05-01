import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { createLink } from "./create-link";
import { InvalidShortUrl } from "@/app/errors/invalid-short-url";
import { ShortUrlAlreadyExists } from "@/app/errors/short-url-already-exists";

// Função para gerar shortUrl único para os testes
function generateUniqueShortUrl(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

describe("Create Link", () => {
  beforeEach(async () => {
    // Limpar a tabela de links antes de cada teste
    await db.delete(schema.links);
  });

  it("should be able to create a link", async () => {
    const shortUrl = generateUniqueShortUrl("github");

    const sut = await createLink({
      originalUrl: "https://github.com/nunes/brevly",
      shortUrl,
    });

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      const link = sut.right;

      expect(link.originalUrl).toBe("https://github.com/nunes/brevly");
      expect(link.shortUrl).toBe(shortUrl);
      expect(link.accessCount).toBe(0);
    }

    // Verificar se o link foi criado no banco
    const createdLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl));

    expect(createdLink).toHaveLength(1);
    expect(createdLink[0].originalUrl).toBe("https://github.com/nunes/brevly");
  });

  it("should not be able to create a link with invalid short URL format", async () => {
    const sut = await createLink({
      originalUrl: "https://github.com/nunes/brevly",
      shortUrl: "in valid", // contém espaço, que não é permitido
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidShortUrl);
  });

  it("should not be able to create a link with an existing short URL", async () => {
    // Gerar um shortUrl único para este teste
    const shortUrl = generateUniqueShortUrl("duplicate");

    // Primeiro, criar um link
    await createLink({
      originalUrl: "https://github.com/nunes/brevly",
      shortUrl,
    });

    // Tentar criar outro link com a mesma URL curta
    const sut = await createLink({
      originalUrl: "https://github.com/outro/projeto",
      shortUrl,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExists);
  });
});
