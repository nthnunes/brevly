import { api } from "../api";

/**
 * Deleta um link a partir da URL encurtada
 * @param shortUrl URL encurtada do link a ser deletado
 */
export async function deleteByShortUrl(shortUrl: string) {
  try {
    await api.delete(`/links/${shortUrl}`);
    return { success: true };
  } catch (error) {
    console.error(`Erro ao deletar link ${shortUrl}:`, error);
    throw error;
  }
}
