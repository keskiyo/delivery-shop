import { Eye } from "lucide-react";
import { ArticleMetaProps } from "../../../types";

const ArticleMeta = ({
  categoryName,
  publishedDate,
  views,
}: ArticleMetaProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
      <span className="rounded-md border border-border bg-card px-3 py-1.5">
        Категория: {categoryName}
      </span>
      {publishedDate && (
        <span className="rounded-md border border-border bg-card px-3 py-1.5">
          Дата: {new Date(publishedDate).toLocaleDateString("ru-RU")}
        </span>
      )}

      <div className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5">
        <Eye className="h-4 w-4" />
        <span>
          <span className="hidden pr-1 md:inline-block">Просмотров:</span>
          {views?.toLocaleString("ru-RU")}
        </span>
      </div>
    </div>
  );
};

export default ArticleMeta;
