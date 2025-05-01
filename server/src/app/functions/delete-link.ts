import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import { LinkNotFound } from "@/app/errors/link-not-found";

export type DeleteLinkOutput = Either<LinkNotFound, { success: true }>;

export async function deleteLink(shortUrl: string): Promise<DeleteLinkOutput> {
  // Verificar se o link existe
  const existingLink = await db
    .select({ id: schema.links.id })
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl));

  if (existingLink.length === 0) {
    return makeLeft(new LinkNotFound(shortUrl));
  }

  // Deletar o link
  await db.delete(schema.links).where(eq(schema.links.shortUrl, shortUrl));

  return makeRight({ success: true });
}
