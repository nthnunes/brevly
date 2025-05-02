import { FormEvent, useState, useEffect } from "react";

interface CreateLinkFormProps {
  onLinkCreated?: (data: { originalUrl: string; shortUrl: string }) => void;
}

export function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Verifica se os dois campos estão preenchidos
  useEffect(() => {
    setIsFormValid(originalUrl.trim() !== "" && shortUrl.trim() !== "");
  }, [originalUrl, shortUrl]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Dados que seriam enviados para o backend
    const data = { originalUrl, shortUrl };

    // Simulando o envio para o backend
    console.log("Dados da requisição:", data);

    if (onLinkCreated) {
      onLinkCreated(data);
    }

    // Limpa os campos após o envio
    setOriginalUrl("");
    setShortUrl("");
  };

  return (
    <div className="w-full bg-white text-gray-600 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg mb-6">Novo link</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="originalUrl"
            className="block text-xs text-gray-500 mb-2"
          >
            LINK ORIGINAL
          </label>
          <input
            type="url"
            id="originalUrl"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="www.exemplo.com.br"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="shortUrl"
            className="block text-xs text-gray-500 mb-2"
          >
            LINK ENCURTADO
          </label>
          <div className="flex">
            <span className="bg-gray-100 p-3 rounded-l-lg border border-gray-300 border-r-0">
              brev.ly/
            </span>
            <input
              type="text"
              id="shortUrl"
              className="w-full p-3 border border-gray-300 rounded-r-lg"
              placeholder="meu-link"
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-base text-white rounded-lg p-3 transition-colors ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid}
        >
          Salvar link
        </button>
      </form>
    </div>
  );
}
