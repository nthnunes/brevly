import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { getOriginalUrl, ShortUrlNotFound } from "./get-original-url";

// Função para gerar shortUrl único para os testes
function generateUniqueShortUrl(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

describe("Get Original URL", () => {
  beforeEach(async () => {
    // Limpar a tabela de links antes de cada teste
    await db.delete(schema.links);
  });

  it("should be able to get the original URL from a short URL", async () => {
    const shortUrl = generateUniqueShortUrl("github");

    // Criar um link para teste
    await db.insert(schema.links).values({
      id: "test-id",
      originalUrl: "https://github.com/nthnunes/brevly",
      shortUrl,
      accessCount: 0,
      createdAt: new Date(),
    });

    const sut = await getOriginalUrl(shortUrl);

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      expect(sut.right.originalUrl).toBe("https://github.com/nthnunes/brevly");
      expect(sut.right.accessCount).toBe(1);
    }

    // Verificar se o contador de acessos foi incrementado no banco
    const updatedLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl));

    expect(updatedLink[0].accessCount).toBe(1);
  });

  it("should increment access count on each access", async () => {
    const shortUrl = generateUniqueShortUrl("counter");

    // Criar um link para teste
    await db.insert(schema.links).values({
      id: "test-id",
      originalUrl: "https://github.com/nthnunes/brevly",
      shortUrl,
      accessCount: 0,
      createdAt: new Date(),
    });

    // Primeiro acesso
    await getOriginalUrl(shortUrl);
    // Segundo acesso
    const sut = await getOriginalUrl(shortUrl);

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      expect(sut.right.accessCount).toBe(2);
    }

    // Verificar no banco
    const updatedLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl));

    expect(updatedLink[0].accessCount).toBe(2);
  });

  it("should not be able to get original URL from non-existing short URL", async () => {
    const nonExistingShortUrl = generateUniqueShortUrl("non-existing");

    const sut = await getOriginalUrl(nonExistingShortUrl);

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlNotFound);
  });
});
