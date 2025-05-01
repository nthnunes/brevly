import { createLink } from "@/app/functions/create-link";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Criar um link encurtado",
        tags: ["links"],
        body: z.object({
          originalUrl: z.string().url("A URL original deve ser uma URL válida"),
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
          201: z
            .object({
              id: z.string(),
              originalUrl: z.string().url(),
              shortUrl: z.string(),
              accessCount: z.number(),
              createdAt: z.string().datetime(),
            })
            .describe("Link criado com sucesso"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { originalUrl, shortUrl } = request.body;

        const result = await createLink({
          originalUrl,
          shortUrl,
        });

        if (isRight(result)) {
          const link = unwrapEither(result);

          return reply.status(201).send({
            id: link.id,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            accessCount: link.accessCount,
            createdAt: link.createdAt.toISOString(),
          });
        }

        const error = unwrapEither(result);

        switch (error.constructor.name) {
          case "InvalidShortUrl":
            return reply.status(400).send({
              message: error.message,
            });
          case "ShortUrlAlreadyExists":
            return reply.status(400).send({
              message: error.message,
            });
          default:
            return reply.status(500).send({
              message: "Erro interno ao criar o link.",
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
