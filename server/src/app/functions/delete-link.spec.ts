import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight, unwrapEither } from "@/shared/either";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { deleteLink, LinkNotFound } from "./delete-link";

// Função para gerar shortUrl único para os testes
function generateUniqueShortUrl(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Função para gerar ID único para os testes
function generateUniqueId(): string {
  return `test-id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

describe("Delete Link", () => {
  beforeEach(async () => {
    // Limpar a tabela de links antes de cada teste
    await db.delete(schema.links);
  });

  it("should be able to delete an existing link", async () => {
    const id = generateUniqueId();
    const shortUrl = generateUniqueShortUrl("delete");

    // Criar um link para depois deletar
    await db.insert(schema.links).values({
      id,
      originalUrl: "https://github.com/nthnunes/brevly",
      shortUrl,
      accessCount: 0,
      createdAt: new Date(),
    });

    const sut = await deleteLink(id);

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      expect(sut.right.success).toBe(true);
    }

    // Verificar se o link foi realmente deletado do banco
    const deletedLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, id));

    expect(deletedLink).toHaveLength(0);
  });

  it("should not be able to delete a non-existing link", async () => {
    const nonExistingId = generateUniqueId();

    const sut = await deleteLink(nonExistingId);

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound);
  });
});
