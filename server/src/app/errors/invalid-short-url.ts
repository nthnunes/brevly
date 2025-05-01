export class InvalidShortUrl extends Error {
  constructor(shortUrl: string) {
    super(`A URL encurtada "${shortUrl}" é inválida.`);
  }
}
