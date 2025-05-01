import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeRight, type Either } from "@/shared/either";
import { desc } from "drizzle-orm";

export type Export = {
  id: string;
  fileName: string;
  remoteKey: string;
  remoteUrl: string;
  createdAt: Date;
};

export type ListExportsOutput = Either<
  never,
  {
    exports: Export[];
  }
>;

export async function listExports(): Promise<ListExportsOutput> {
  const exports = await db
    .select()
    .from(schema.exports)
    .orderBy(desc(schema.exports.createdAt));

  return makeRight({
    exports: exports.map((export_) => ({
      id: export_.id,
      fileName: export_.fileName,
      remoteKey: export_.remoteKey,
      remoteUrl: export_.remoteUrl,
      createdAt: export_.createdAt,
    })),
  });
}
