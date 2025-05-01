import { listLinks } from "@/app/functions/list-links";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links",
    {
      schema: {
        summary: "Listar todas as URLs cadastradas",
        tags: ["links"],
        response: {
          200: z
            .object({
              links: z.array(
                z.object({
                  id: z.string(),
                  originalUrl: z.string().url(),
                  shortUrl: z.string(),
                  accessCount: z.number(),
                  createdAt: z.string().datetime(),
                })
              ),
            })
            .describe("Lista de URLs cadastradas"),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await listLinks();

        if (isRight(result)) {
          return reply.status(200).send({
            links: result.right.links.map((link) => ({
              id: link.id,
              originalUrl: link.originalUrl,
              shortUrl: link.shortUrl,
              accessCount: link.accessCount,
              createdAt: link.createdAt.toISOString(),
            })),
          });
        }

        // Esse caso nunca deve acontecer, pois a função listLinks sempre retorna Right
        return reply.status(500).send({
          message: "Erro interno ao listar os links.",
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
