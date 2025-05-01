export class ShortUrlAlreadyExists extends Error {
  constructor(shortUrl: string) {
    super(`A URL encurtada "${shortUrl}" já existe.`);
  }
}
