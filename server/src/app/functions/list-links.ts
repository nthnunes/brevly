import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeRight, type Either } from "@/shared/either";

export type Link = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
};

export type ListLinksOutput = Either<
  never,
  {
    links: Link[];
  }
>;

export async function listLinks(): Promise<ListLinksOutput> {
  const links = await db
    .select()
    .from(schema.links)
    .orderBy(schema.links.createdAt);

  return makeRight({
    links: links.map((link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      accessCount: link.accessCount,
      createdAt: link.createdAt,
    })),
  });
}
