import { AlertCircle, Clock } from "lucide-react";

const ArticleArchiveNotice = ({
  message = "Статья находится в архиве. Информация может быть устаревшей.",
  className = "",
  updatedAt = "Неизвестно",
}: {
  message?: string;
  className?: string;
  updatedAt?: string;
}) => {
  return (
    <div
      className={`
        mb-4 flex flex-col items-start gap-3 rounded-md border border-warning/40
        bg-warning-soft p-3 text-sm text-warning-foreground
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{message}</p>
      </div>
      <div className="flex items-center gap-x-2 text-sm opacity-80">
        <Clock className="h-3 w-3" />
        <span>
          Последнее обновление:{" "}
          {updatedAt
            ? new Date(updatedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : "неизвестно"}
        </span>
      </div>
    </div>
  );
};

export default ArticleArchiveNotice;
