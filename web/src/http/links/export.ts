import { api } from "../api";
import { z } from "zod";

const exportResponseSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  downloadUrl: z.string().url(),
  createdAt: z.string().datetime(),
});

export type ExportResponse = z.infer<typeof exportResponseSchema>;

/**
 * Exporta links para um arquivo CSV
 */
export async function exportLinks(): Promise<ExportResponse> {
  try {
    const response = await api.post<ExportResponse>("/links/export");
    return exportResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Erro ao exportar links:", error);
    throw error;
  }
}
