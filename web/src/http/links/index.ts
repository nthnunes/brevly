import { getAll } from "./get-all";
import { deleteByShortUrl } from "./delete";
import { create } from "./create";
import type { Link, GetLinksResponse } from "./get-all";
import type { CreateLinkRequest, CreateLinkResponse } from "./create";

export { getAll, deleteByShortUrl, create };
export type { Link, GetLinksResponse, CreateLinkRequest, CreateLinkResponse };
