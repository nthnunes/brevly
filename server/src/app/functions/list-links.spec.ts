import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isRight } from "@/shared/either";
import { beforeEach, describe, expect, it } from "vitest";
import { listLinks } from "./list-links";

// Função para gerar shortUrl único para os testes
function generateUniqueShortUrl(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Função para gerar ID único para os testes
function generateUniqueId(): string {
  return `test-id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

describe("List Links", () => {
  beforeEach(async () => {
    // Limpar a tabela de links antes de cada teste
    await db.delete(schema.links);
  });

  it("should return an empty array when there are no links", async () => {
    const sut = await listLinks();

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      expect(sut.right.links).toEqual([]);
    }
  });

  it("should list all links", async () => {
    // Inserir links de teste
    const now = new Date();
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    const shortUrl1 = generateUniqueShortUrl("list1");
    const shortUrl2 = generateUniqueShortUrl("list2");

    const links = [
      {
        id: id1,
        originalUrl: "https://github.com/nthnunes/brevly",
        shortUrl: shortUrl1,
        accessCount: 5,
        createdAt: now,
      },
      {
        id: id2,
        originalUrl: "https://example.com",
        shortUrl: shortUrl2,
        accessCount: 10,
        createdAt: new Date(now.getTime() + 1000), // 1 segundo depois
      },
    ];

    // Inserir os links no banco
    for (const link of links) {
      await db.insert(schema.links).values(link);
    }

    const sut = await listLinks();

    expect(isRight(sut)).toBe(true);

    if (isRight(sut)) {
      expect(sut.right.links).toHaveLength(2);

      // Verificar se os links foram retornados na ordem correta (por createdAt)
      expect(sut.right.links[0].id).toBe(id1);
      expect(sut.right.links[1].id).toBe(id2);

      // Verificar se todos os atributos estão presentes
      expect(sut.right.links[0]).toEqual({
        id: id1,
        originalUrl: "https://github.com/nthnunes/brevly",
        shortUrl: shortUrl1,
        accessCount: 5,
        createdAt: expect.any(Date),
      });
    }
  });
});
