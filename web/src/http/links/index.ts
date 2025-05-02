import { getAll } from "./get-all";
import { deleteByShortUrl } from "./delete";
import { create } from "./create";
import { getOriginalUrl } from "./redirect";
import type { Link, GetLinksResponse } from "./get-all";
import type { CreateLinkRequest, CreateLinkResponse } from "./create";
import type { RedirectResponse } from "./redirect";

export { getAll, deleteByShortUrl, create, getOriginalUrl };
export type {
  Link,
  GetLinksResponse,
  CreateLinkRequest,
  CreateLinkResponse,
  RedirectResponse,
};
