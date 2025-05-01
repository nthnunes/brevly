import { getOriginalUrl } from "@/app/functions/get-original-url";
import { isLeft, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/:shortUrl",
    {
      schema: {
        summary: "Obter URL original a partir da URL encurtada",
        tags: ["links"],
        params: z.object({
          shortUrl: z
            .string()
            .min(3, "A URL encurtada deve ter pelo menos 3 caracteres")
            .max(20, "A URL encurtada deve ter no máximo 20 caracteres")
            .regex(
              /^[a-zA-Z0-9-_]+$/,
              "A URL encurtada deve conter apenas letras, números, hífens e underscores"
            ),
        }),
        response: {
          200: z
            .object({
              originalUrl: z.string(),
            })
            .describe("URL original obtida com sucesso"),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { shortUrl } = request.params;

        const result = await getOriginalUrl(shortUrl);

        if (isLeft(result)) {
          const error = unwrapEither(result);

          switch (error.constructor.name) {
            case "ShortUrlNotFound":
              return reply.status(404).send({
                message: error.message,
              });
            default:
              return reply.status(500).send({
                message: "Erro interno ao buscar o link.",
              });
          }
        }

        return reply.status(200).send({
          originalUrl: result.right.originalUrl,
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
