import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isRight } from "@/shared/either";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportLinksToCSV } from "./export-links-to-csv";

// Mock para a função de upload
vi.mock("@/infra/storage/upload-file-to-storage", () => {
  return {
    uploadFileToStorage: vi.fn().mockResolvedValue({
      key: "downloads/mocked-key.csv",
      url: "https://example.com/downloads/mocked-key.csv",
    }),
  };
});

// Mock para o módulo csv-stringify
vi.mock("csv-stringify", () => {
  const mockStringify = vi.fn().mockImplementation(() => {
    const { Transform } = require("stream");
    return new Transform({
      objectMode: true,
      transform(
        chunk: unknown,
        encoding: string,
        callback: (error: Error | null, data?: unknown) => void
      ) {
        // Simular transformação em CSV
        callback(null, JSON.stringify(chunk) + "\n");
      },
    });
  });

  return {
    stringify: mockStringify,
  };
});

// Função para gerar shortUrl único para os testes
function generateUniqueShortUrl(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

describe("Export Links to CSV", () => {
  beforeEach(async () => {
    // Limpar tabelas antes de cada teste
    await db.delete(schema.exports);
    await db.delete(schema.links);
  });

  it("should export links to CSV", async () => {
    // Criar alguns links para o teste
    const now = new Date();
    const shortUrl1 = generateUniqueShortUrl("export1");
    const shortUrl2 = generateUniqueShortUrl("export2");

    await db.insert(schema.links).values([
      {
        id: "test-id-1",
        originalUrl: "https://github.com/nthnunes/brevly",
        shortUrl: shortUrl1,
        accessCount: 5,
        createdAt: now,
      },
      {
        id: "test-id-2",
        originalUrl: "https://example.com",
        shortUrl: shortUrl2,
        accessCount: 10,
        createdAt: new Date(now.getTime() + 1000),
      },
    ]);

    // Executar a exportação
    const result = await exportLinksToCSV();

    // Verificar se o resultado é um Right
    expect(isRight(result)).toBe(true);

    if (isRight(result)) {
      // Verificar os atributos da exportação
      expect(result.right.id).toBeDefined();
      expect(result.right.fileName).toMatch(/links-export-.+\.csv/);
      expect(result.right.remoteKey).toBe("downloads/mocked-key.csv");
      expect(result.right.remoteUrl).toBe(
        "https://example.com/downloads/mocked-key.csv"
      );
      expect(result.right.createdAt).toBeInstanceOf(Date);
    }

    // Verificar se o registro da exportação foi salvo no banco
    const savedExports = await db.select().from(schema.exports);
    expect(savedExports).toHaveLength(1);
    expect(savedExports[0].fileName).toMatch(/links-export-.+\.csv/);
    expect(savedExports[0].remoteKey).toBe("downloads/mocked-key.csv");
  });

  it("should handle empty links table", async () => {
    // Executar a exportação sem links cadastrados
    const result = await exportLinksToCSV();

    // Verificar se o resultado é um Right
    expect(isRight(result)).toBe(true);

    if (isRight(result)) {
      // Verificar os atributos da exportação
      expect(result.right.id).toBeDefined();
      expect(result.right.fileName).toMatch(/links-export-.+\.csv/);
    }

    // Verificar se o registro da exportação foi salvo no banco
    const savedExports = await db.select().from(schema.exports);
    expect(savedExports).toHaveLength(1);
  });
});
