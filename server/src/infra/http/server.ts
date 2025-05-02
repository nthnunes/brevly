import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/create-link";
import { deleteLinkRoute } from "./routes/delete-link";
import { exportLinksRoute } from "./routes/export-links";
import { getOriginalUrlRoute } from "./routes/get-original-url";
import { listExportsRoute } from "./routes/list-exports";
import { listLinksRoute } from "./routes/list-links";
import { transformSwaggerSchema } from "./transform-swagger-schema";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.validation,
    });
  }

  console.error(error);

  return reply.status(500).send({
    message: error.message,
  });
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 horas em segundos
});

server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brevly API",
      description: "API para o serviço de encurtamento de URLs Brevly",
      version: "1.0.0",
    },
  },
  transform: transformSwaggerSchema,
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(createLinkRoute);
server.register(deleteLinkRoute);
server.register(getOriginalUrlRoute);
server.register(listLinksRoute);
server.register(exportLinksRoute);
server.register(listExportsRoute);

server
  .listen({ port: 3333, host: "0.0.0.0" })
  .then(() => {
    console.log("Server is running on http://0.0.0.0:3333");
    console.log("Swagger UI is running on http://0.0.0.0:3333/docs");
  })
  .catch((err) => {
    console.error(err);
  });
