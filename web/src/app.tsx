import { useState } from "react";
import { CreateLinkForm } from "./components/CreateLinkForm";
import { LinksList } from "./components/LinksList";

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
}

export function App() {
  const [links, setLinks] = useState<Link[]>([]);

  const handleLinkCreated = (data: {
    originalUrl: string;
    shortUrl: string;
  }) => {
    const newLink: Link = {
      id: crypto.randomUUID(),
      originalUrl: data.originalUrl,
      shortUrl: data.shortUrl,
      accessCount: 0,
    };

    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  return (
    <main className="min-h-dvh flex flex-col items-center bg-gray-100 pt-6 pb-6 px-4 lg:pt-20 md:px-32">
      <div className="w-full flex gap-6 justify-center flex-wrap lg:flex-nowrap">
        <div className="w-full lg:max-w-sm flex flex-col">
          <img
            src="/Logo.png"
            alt="Brevly Logo"
            className="h-8 mb-10 self-start"
          />
          <CreateLinkForm onLinkCreated={handleLinkCreated} />
        </div>
        <div className="w-full flex flex-col lg:pt-[72px]">
          <LinksList links={links} />
        </div>
      </div>
    </main>
  );
}
