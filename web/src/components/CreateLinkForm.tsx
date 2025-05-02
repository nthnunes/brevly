import { FormEvent, useState, useEffect } from "react";
import { create as createLink } from "../http/links";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface CreateLinkFormProps {
  onLinkCreated?: (data: {
    originalUrl: string;
    shortUrl: string;
    id: string;
    accessCount: number;
    createdAt: string;
  }) => void;
}

const formSchema = z.object({
  originalUrl: z.string().url("A URL original deve ser uma URL válida"),
  shortUrl: z
    .string()
    .min(3, "A URL encurtada deve ter pelo menos 3 caracteres")
    .max(20, "A URL encurtada deve ter no máximo 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "A URL encurtada deve conter apenas letras, números, hífens e sublinhados"
    ),
});

type FormErrors = {
  originalUrl?: string;
  shortUrl?: string;
};

export function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [originalUrl, shortUrl, submitted]);

  const validateForm = () => {
    try {
      formSchema.parse({
        originalUrl,
        shortUrl,
      });
      setFieldErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0] === "originalUrl") {
            errors.originalUrl = error.message;
          } else if (error.path[0] === "shortUrl") {
            errors.shortUrl = error.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const data = { originalUrl, shortUrl };
      const response = await createLink(data);

      if (onLinkCreated) {
        onLinkCreated({
          originalUrl: response.originalUrl,
          shortUrl: response.shortUrl,
          id: response.id,
          accessCount: response.accessCount,
          createdAt: response.createdAt,
        });
      }

      setOriginalUrl("");
      setShortUrl("");
      setSubmitted(false);
      setFieldErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0] === "originalUrl") {
            errors.originalUrl = error.message;
          } else if (error.path[0] === "shortUrl") {
            errors.shortUrl = error.message;
          }
        });
        setFieldErrors(errors);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro ao criar o link");
      }
      console.error("Erro ao criar link:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = originalUrl.trim() !== "" && shortUrl.trim() !== "";

  return (
    <div className="w-full bg-white text-gray-600 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg mb-6">Novo link</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="originalUrl"
            className="block text-xs text-gray-500 mb-2"
          >
            LINK ORIGINAL
          </label>
          <input
            type="text"
            id="originalUrl"
            className={`w-full p-3 border rounded-lg ${
              fieldErrors.originalUrl
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="www.exemplo.com.br"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.originalUrl && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.originalUrl}
            </p>
          )}
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
              className={`w-full p-3 border rounded-r-lg ${
                fieldErrors.shortUrl
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="meu-link"
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          {fieldErrors.shortUrl && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.shortUrl}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-base text-white rounded-lg p-3 transition-colors flex items-center justify-center ${
            !isFormValid || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-dark"
          }`}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            "Salvar link"
          )}
        </button>
      </form>
    </div>
  );
}
