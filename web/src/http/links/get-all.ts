import { api } from "../api";
import { z } from "zod";

// Schema para validar a resposta da API
const linkSchema = z.object({
  id: z.string().uuid(),
  originalUrl: z.string().url(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.string().datetime(),
});

const getLinksResponseSchema = z.object({
  links: z.array(linkSchema),
});

// Tipos inferidos dos schemas
export type Link = z.infer<typeof linkSchema>;
export type GetLinksResponse = z.infer<typeof getLinksResponseSchema>;

/**
 * Busca todos os links cadastrados
 */
export async function getAll() {
  try {
    const response = await api.get<GetLinksResponse>("/links");
    return getLinksResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Erro ao buscar links:", error);
    throw error;
  }
}
