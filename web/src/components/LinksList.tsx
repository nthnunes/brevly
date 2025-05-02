import {
  ArrowDownToLine,
  Clipboard,
  Trash2,
  Link,
  Loader2,
} from "lucide-react";
import { env } from "../utils/env";
import { deleteByShortUrl } from "../http/links";
import { useState } from "react";

interface LinksListProps {
  links?: Link[];
  isLoading?: boolean;
  onDeleteLink?: (shortUrl: string) => void;
}

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount?: number;
}

export function LinksList({
  links = [],
  isLoading = false,
  onDeleteLink,
}: LinksListProps) {
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());

  const handleDownloadCSV = () => {
    // Implementação para exportar links como CSV
    console.log("Exportar como CSV");
  };

  const handleCopyLink = (shortUrl: string) => {
    const fullUrl = `${env.FRONTEND_URL}/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    console.log(`Link copiado: ${fullUrl}`);
  };

  const handleDeleteLink = async (link: Link) => {
    try {
      // Marca o link como sendo deletado
      setDeletingLinks((prev) => new Set(prev).add(link.shortUrl));

      // Chama a API para deletar o link
      await deleteByShortUrl(link.shortUrl);

      // Notifica o componente pai sobre a deleção
      if (onDeleteLink) {
        onDeleteLink(link.shortUrl);
      }
    } catch (error) {
      console.error(`Erro ao deletar link: ${link.shortUrl}`, error);
    } finally {
      // Remove o link da lista de links sendo deletados
      setDeletingLinks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(link.shortUrl);
        return newSet;
      });
    }
  };

  const hasLinks = links.length > 0;

  return (
    <div className="w-full bg-white text-gray-600 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg">Meus links</h2>
        <button
          onClick={handleDownloadCSV}
          className={`flex items-center gap-1 text-sm text-gray-500 bg-gray-200 rounded-lg p-2 transition-colors ${
            hasLinks
              ? "hover:text-gray-700 hover:bg-gray-300"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!hasLinks}
        >
          <ArrowDownToLine size={16} />
          Baixar CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="text-gray-400 animate-spin mb-2" />
          <p className="text-sm text-gray-400">Carregando links...</p>
        </div>
      ) : hasLinks ? (
        <div className="space-y-4">
          {links.map((link) => {
            const isDeleting = deletingLinks.has(link.shortUrl);

            return (
              <div key={link.id} className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <a
                    href={`${env.FRONTEND_URL}/${link.shortUrl}`}
                    className="text-blue-600 font-semibold hover:underline"
                    target="_blank"
                  >
                    {new URL(env.FRONTEND_URL).hostname}/{link.shortUrl}
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-3">
                      {link.accessCount || 0} acessos
                    </span>
                    <button
                      onClick={() => handleCopyLink(link.shortUrl)}
                      className="text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg p-2"
                      disabled={isDeleting}
                    >
                      <Clipboard size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link)}
                      className={`text-gray-400 bg-gray-200 rounded-lg p-2 ${
                        isDeleting
                          ? "opacity-50 cursor-wait"
                          : "hover:text-red-500 hover:bg-gray-300"
                      }`}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {link.originalUrl}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <Link size={16} />
          </div>
          <p className="text-sm">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
        </div>
      )}
    </div>
  );
}
