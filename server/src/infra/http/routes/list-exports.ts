import { listExports } from "@/app/functions/list-exports";
import { isRight } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listExportsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/exports",
    {
      schema: {
        summary: "Listar exportações de links",
        tags: ["exports"],
        response: {
          200: z
            .object({
              exports: z.array(
                z.object({
                  id: z.string(),
                  fileName: z.string(),
                  downloadUrl: z.string().url(),
                  createdAt: z.string().datetime(),
                })
              ),
            })
            .describe("Lista de exportações"),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await listExports();

        if (isRight(result)) {
          return reply.status(200).send({
            exports: result.right.exports.map((export_) => ({
              id: export_.id,
              fileName: export_.fileName,
              downloadUrl: export_.remoteUrl,
              createdAt: export_.createdAt.toISOString(),
            })),
          });
        }

        // Esse caso nunca deve acontecer, pois a função listExports sempre retorna Right
        return reply.status(500).send({
          message: "Erro interno ao listar as exportações.",
        });
      } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return reply.status(500).send({
          message: "Erro interno ao processar a requisição.",
        });
      }
    }
  );
};
