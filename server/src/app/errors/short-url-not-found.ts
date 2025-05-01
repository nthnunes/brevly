export class ShortUrlNotFound extends Error {
  constructor(shortUrl: string) {
    super(`URL encurtada "${shortUrl}" não encontrada.`);
  }
}
