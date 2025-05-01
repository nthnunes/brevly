import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const exportFiles = pgTable("exports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  fileName: text("file_name").notNull(),
  remoteKey: text("remote_key").notNull().unique(),
  remoteUrl: text("remote_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
