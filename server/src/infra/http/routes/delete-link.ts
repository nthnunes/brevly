import { deleteLink } from "@/app/functions/delete-link";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/links/:shortUrl",
    {
      schema: {
        summary: "Deletar um link encurtado",
        tags: ["links"],
        params: z.object({
          shortUrl: z.string().min(1, "O shortUrl não pode estar vazio"),
        }),
        response: {
          200: z
            .object({
              success: z.boolean(),
            })
            .describe("Link deletado com sucesso"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Link não encontrado"),
        },
      },
    },
    async (request, reply) => {
      try {
        const { shortUrl } = request.params;

        const result = await deleteLink(shortUrl);

        if (isRight(result)) {
          return reply.status(200).send({
            success: true,
          });
        }

        const error = unwrapEither(result);

        switch (error.constructor.name) {
          case "LinkNotFound":
            return reply.status(404).send({
              message: error.message,
            });
          default:
            console.error("Erro não tratado:", error);
            return reply.status(500).send({
              message: "Erro interno ao deletar o link.",
            });
        }
      } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return reply.status(500).send({
          message: "Erro interno ao processar a requisição.",
        });
      }
    }
  );
};
