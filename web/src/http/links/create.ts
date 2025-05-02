import { api } from "../api";
import { z } from "zod";

// Schema para validar a requisição
const createLinkRequestSchema = z.object({
  originalUrl: z.string().url("URL original inválida"),
  shortUrl: z.string().min(1, "URL encurtada é obrigatória"),
});

// Schema para validar a resposta
// A API retorna diretamente o objeto link em vez de um objeto com uma propriedade "link"
const createLinkResponseSchema = z.object({
  id: z.string().uuid(),
  originalUrl: z.string().url(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.string().datetime(),
});

// Tipos inferidos dos schemas
export type CreateLinkRequest = z.infer<typeof createLinkRequestSchema>;
export type CreateLinkResponse = z.infer<typeof createLinkResponseSchema>;

/**
 * Cria um novo link encurtado
 */
export async function create(data: CreateLinkRequest) {
  try {
    // Valida os dados antes de enviar
    const validatedData = createLinkRequestSchema.parse(data);

    // Envia a requisição para a API
    const response = await api.post<CreateLinkResponse>(
      "/links",
      validatedData
    );

    // Valida a resposta
    return createLinkResponseSchema.parse(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação:", error.errors);
    } else {
      console.error("Erro ao criar link:", error);
    }
    throw error;
  }
}
