import { api } from "../api";
import { z } from "zod";

// Schema para validar a resposta da API
const redirectResponseSchema = z.object({
  originalUrl: z.string().url(),
});

export type RedirectResponse = z.infer<typeof redirectResponseSchema>;

/**
 * Busca a URL original a partir da URL curta
 * @param shortUrl URL encurtada para obter a URL original
 */
export async function getOriginalUrl(
  shortUrl: string
): Promise<RedirectResponse> {
  try {
    const response = await api.get<RedirectResponse>(`/${shortUrl}`);
    return redirectResponseSchema.parse(response.data);
  } catch (error) {
    console.error(`Erro ao buscar URL original para ${shortUrl}:`, error);
    throw error;
  }
}
