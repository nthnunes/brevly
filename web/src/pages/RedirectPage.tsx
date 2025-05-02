import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOriginalUrl } from "../http/links";

export function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Evita re-execução se uma requisição já estiver em andamento ou concluída
    if (!shortUrl || isRedirecting || originalUrl) return;

    async function redirectToOriginalUrl() {
      setIsRedirecting(true);

      try {
        const urlParam = shortUrl as string;
        const response = await getOriginalUrl(urlParam);

        setOriginalUrl(response.originalUrl);
        window.location.href = response.originalUrl;
      } catch (err) {
        console.error("Erro ao buscar URL original:", err);
        setError("Link não encontrado ou inválido");
        setIsRedirecting(false);
      }
    }

    redirectToOriginalUrl();
  }, [shortUrl, isRedirecting, originalUrl]);

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-3">
            <img
              src="/404.png"
              alt="404 - Link não encontrado"
              className="h-20"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-5">
            Link não encontrado
          </h1>
          <p className="text-gray-500 text-sm">
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida. Saiba mais em{" "}
            <a href="/" className="text-blue-base hover:underline">
              brev.ly
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <img src="/Logo_Icon.png" alt="Brevly Logo" width="43" height="43" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-5">
          Redirecionando...
        </h1>

        <p className="text-gray-600 text-sm mb-3">
          O link será aberto automaticamente em alguns instantes.
        </p>

        <p className="text-gray-600 text-sm">
          Não foi redirecionado?{" "}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              if (originalUrl) {
                window.location.href = originalUrl;
              }
            }}
            className="text-blue-base hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  );
}
