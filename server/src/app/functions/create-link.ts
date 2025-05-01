import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ShortUrlAlreadyExists } from "@/app/errors/short-url-already-exists";
import { InvalidShortUrl } from "@/app/errors/invalid-short-url";

const createLinkInput = z.object({
  originalUrl: z.string().url("A URL original deve ser uma URL válida"),
  shortUrl: z
    .string()
    .min(3, "A URL encurtada deve ter pelo menos 3 caracteres")
    .max(20, "A URL encurtada deve ter no máximo 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "A URL encurtada deve conter apenas letras, números, hífens e sublinhados"
    ),
});

export type CreateLinkInput = z.input<typeof createLinkInput>;
export type CreateLinkOutput = Either<
  ShortUrlAlreadyExists | InvalidShortUrl,
  {
    id: string;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
  }
>;

export async function createLink(
  input: CreateLinkInput
): Promise<CreateLinkOutput> {
  const parsed = createLinkInput.safeParse(input);

  if (!parsed.success) {
    return makeLeft(new InvalidShortUrl(input.shortUrl));
  }

  // Verificar se já existe um link com a URL encurtada solicitada
  const existingLink = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, parsed.data.shortUrl));

  if (existingLink.length > 0) {
    return makeLeft(new ShortUrlAlreadyExists(parsed.data.shortUrl));
  }

  // Criar o link no banco
  const [link] = await db
    .insert(schema.links)
    .values({
      originalUrl: parsed.data.originalUrl,
      shortUrl: parsed.data.shortUrl,
    })
    .returning();

  return makeRight({
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: link.shortUrl,
    accessCount: link.accessCount,
    createdAt: link.createdAt,
  });
}
