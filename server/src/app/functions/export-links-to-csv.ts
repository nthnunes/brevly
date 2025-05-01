import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { makeRight, type Either } from "@/shared/either";
import { stringify } from "csv-stringify";
import { Readable } from "node:stream";
import { uuidv7 } from "uuidv7";

export type Export = {
  id: string;
  fileName: string;
  remoteKey: string;
  remoteUrl: string;
  createdAt: Date;
};

export type ExportLinksToCSVOutput = Either<never, Export>;

export async function exportLinksToCSV(): Promise<ExportLinksToCSVOutput> {
  // 1. Buscar todos os links do banco de dados
  const links = await db
    .select()
    .from(schema.links)
    .orderBy(schema.links.createdAt);

  // 2. Preparar o stream de dados para o CSV
  const csvData = links.map((link) => ({
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: link.shortUrl,
    accessCount: link.accessCount,
    createdAt: link.createdAt.toISOString(),
  }));

  // 3. Transformar os dados em um stream legível
  const dataStream = Readable.from(csvData);

  // 4. Criar um nome único para o arquivo
  const exportId = uuidv7();
  const fileName = `links-export-${exportId}.csv`;

  // 5. Configurar o stream CSV
  const stringifier = stringify({
    header: true,
    columns: {
      id: "ID",
      originalUrl: "URL Original",
      shortUrl: "URL Encurtada",
      accessCount: "Contagem de Acessos",
      createdAt: "Data de Criação",
    },
  });

  // 6. Pipe dos dados para o stream CSV
  const contentStream = dataStream.pipe(stringifier);

  // 7. Fazer upload do arquivo para o R2
  const { key, url } = await uploadFileToStorage({
    folder: "downloads",
    fileName,
    contentType: "text/csv",
    contentStream,
  });

  // 8. Salvar os metadados da exportação no banco
  const [export_] = await db
    .insert(schema.exports)
    .values({
      id: exportId,
      fileName,
      remoteKey: key,
      remoteUrl: url,
    })
    .returning();

  return makeRight({
    id: export_.id,
    fileName: export_.fileName,
    remoteKey: export_.remoteKey,
    remoteUrl: export_.remoteUrl,
    createdAt: export_.createdAt,
  });
}
