import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";
import { ShortUrlNotFound } from "@/app/errors/short-url-not-found";

export type GetOriginalUrlOutput = Either<
  ShortUrlNotFound,
  {
    originalUrl: string;
    accessCount: number;
  }
>;

export async function getOriginalUrl(
  shortUrl: string
): Promise<GetOriginalUrlOutput> {
  const link = await db
    .select({
      originalUrl: schema.links.originalUrl,
      accessCount: schema.links.accessCount,
    })
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl));

  if (link.length === 0) {
    return makeLeft(new ShortUrlNotFound(shortUrl));
  }

  // Incrementar o contador de acessos
  await db
    .update(schema.links)
    .set({ accessCount: link[0].accessCount + 1 })
    .where(eq(schema.links.shortUrl, shortUrl));

  return makeRight({
    originalUrl: link[0].originalUrl,
    accessCount: link[0].accessCount + 1,
  });
}
