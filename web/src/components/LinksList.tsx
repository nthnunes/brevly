import {
  ArrowDownToLine,
  Clipboard,
  Trash2,
  Link,
  Loader2,
} from "lucide-react";
import { env } from "../utils/env";
import { deleteByShortUrl, exportLinks } from "../http/links";
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
  createdAt: string;
}

export function LinksList({
  links = [],
  isLoading = false,
  onDeleteLink,
}: LinksListProps) {
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadCSV = async () => {
    if (isExporting || !hasLinks) return;

    try {
      setIsExporting(true);

      const response = await exportLinks();

      const downloadLink = document.createElement("a");
      downloadLink.href = response.downloadUrl;
      downloadLink.download = response.fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = (shortUrl: string) => {
    const fullUrl = `${env.FRONTEND_URL}/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    console.log(`Link copiado: ${fullUrl}`);
  };

  const handleDeleteLink = async (link: Link) => {
    try {
      setDeletingLinks((prev) => new Set(prev).add(link.shortUrl));

      await deleteByShortUrl(link.shortUrl);

      if (onDeleteLink) {
        onDeleteLink(link.shortUrl);
      }
    } catch (error) {
      console.error(`Erro ao deletar link: ${link.shortUrl}`, error);
    } finally {
      setDeletingLinks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(link.shortUrl);
        return newSet;
      });
    }
  };

  const hasLinks = links.length > 0;

  // Ordena os links por data de criação (do mais novo para o mais antigo)
  const sortedLinks = [...links].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="w-full bg-white text-gray-600 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg">Meus links</h2>
        <button
          onClick={handleDownloadCSV}
          className={`flex items-center gap-1 text-sm text-gray-500 bg-gray-200 rounded p-2 transition-colors ${
            hasLinks && !isExporting
              ? "hover:text-blue-base box-border border hover:border-blue-base"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!hasLinks || isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin mr-1" />
              Exportando...
            </>
          ) : (
            <>
              <ArrowDownToLine size={16} />
              Baixar CSV
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="text-gray-400 animate-spin mb-2" />
          <p className="text-sm text-gray-400">Carregando links...</p>
        </div>
      ) : hasLinks ? (
        <div className="space-y-4">
          {sortedLinks.map((link) => {
            const isDeleting = deletingLinks.has(link.shortUrl);

            return (
              <div key={link.id} className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <div className="flex flex-col justify-center">
                    <a
                      href={`${env.FRONTEND_URL}/${link.shortUrl}`}
                      className="text-blue-base font-semibold hover:underline"
                      target="_blank"
                    >
                      {`brev.ly/${link.shortUrl}`}
                    </a>
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {link.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 h-full">
                    <span className="text-sm text-gray-500 mr-3">
                      {link.accessCount || 0} acessos
                    </span>
                    <button
                      onClick={() => handleCopyLink(link.shortUrl)}
                      className="text-gray-400 box-border border hover:border-blue-base hover:text-blue-base bg-gray-200 transition-colors rounded p-2"
                      disabled={isDeleting}
                    >
                      <Clipboard size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link)}
                      className={`text-gray-400 bg-gray-200 rounded p-2 ${
                        isDeleting
                          ? "opacity-50 cursor-wait"
                          : "hover:text-danger box-border border hover:border-danger"
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-4">
          <Link size={28} />
          <p className="text-sm">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
        </div>
      )}
    </div>
  );
}
