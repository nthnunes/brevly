import { z } from "zod";

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

const envVars: Env = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
};

try {
  envSchema.parse(envVars);
} catch (error) {
  console.error("❌ Erro nas variáveis de ambiente:", error);
  throw new Error("Falha na validação das variáveis de ambiente");
}

export const env = envVars;
