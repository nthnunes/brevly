import { useState, useEffect } from "react";
import { CreateLinkForm } from "./components/CreateLinkForm";
import { LinksList } from "./components/LinksList";
import { getAll } from "./http/links/get-all";

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
}

export function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLinks() {
      try {
        setIsLoading(true);
        const response = await getAll();

        setLinks(response.links);
      } catch (error) {
        console.error("Erro ao buscar links:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLinks();
  }, []);

  const handleLinkCreated = (newLink: Link) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleLinkDeleted = (shortUrl: string) => {
    setLinks((prevLinks) =>
      prevLinks.filter((link) => link.shortUrl !== shortUrl)
    );
  };

  return (
    <main className="min-h-dvh flex flex-col items-center bg-gray-200 pt-6 pb-6 px-4 lg:pt-20 md:px-16 lg:px-32">
      <div className="w-full flex gap-6 justify-center flex-wrap lg:flex-nowrap">
        <div className="w-full lg:max-w-sm flex flex-col">
          <img
            src="/Logo.svg"
            alt="Brevly Logo"
            className="h-8 mb-10 self-start"
          />
          <CreateLinkForm onLinkCreated={handleLinkCreated} />
        </div>
        <div className="w-full flex flex-col lg:pt-[72px]">
          <LinksList
            links={links}
            isLoading={isLoading}
            onDeleteLink={handleLinkDeleted}
          />
        </div>
      </div>
    </main>
  );
}
