import { getAll } from "./get-all";
import { deleteByShortUrl } from "./delete";
import { create } from "./create";
import { getOriginalUrl } from "./redirect";
import { exportLinks } from "./export";
import type { Link, GetLinksResponse } from "./get-all";
import type { CreateLinkRequest, CreateLinkResponse } from "./create";
import type { RedirectResponse } from "./redirect";
import type { ExportResponse } from "./export";

export { getAll, deleteByShortUrl, create, getOriginalUrl, exportLinks };
export type {
  Link,
  GetLinksResponse,
  CreateLinkRequest,
  CreateLinkResponse,
  RedirectResponse,
  ExportResponse,
};
