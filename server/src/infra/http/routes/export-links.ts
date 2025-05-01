import { exportLinksToCSV } from "@/app/functions/export-links-to-csv";
import { isRight } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links/export",
    {
      schema: {
        summary: "Exportar links para CSV",
        tags: ["links"],
        response: {
          200: z
            .object({
              id: z.string(),
              fileName: z.string(),
              downloadUrl: z.string().url(),
              createdAt: z.string().datetime(),
            })
            .describe("Dados da exportação"),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await exportLinksToCSV();

        if (isRight(result)) {
          return reply.status(200).send({
            id: result.right.id,
            fileName: result.right.fileName,
            downloadUrl: result.right.remoteUrl,
            createdAt: result.right.createdAt.toISOString(),
          });
        }

        // Esse caso nunca deve acontecer, pois a função exportLinksToCSV sempre retorna Right
        return reply.status(500).send({
          message: "Erro interno ao exportar os links.",
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
