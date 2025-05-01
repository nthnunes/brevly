export class LinkNotFound extends Error {
  constructor(id: string) {
    super(`Link com ID "${id}" não encontrado.`);
  }
}
