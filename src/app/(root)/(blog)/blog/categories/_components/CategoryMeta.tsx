import { BlogCategoryMetaProps } from "../types/categories.types";

export default function CategoryMeta({
  createdAt,
  author,
}: BlogCategoryMetaProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-3">
      <time
        dateTime={createdAt}
        className="text-xs text-muted-foreground font-medium"
        title={formattedDate}
      >
        {formattedDate}
      </time>

      {author && (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-brand mr-1.5"></div>
          <span className="text-xs text-muted-foreground font-medium">{author}</span>
        </div>
      )}
    </div>
  );
}
