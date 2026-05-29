import { Search } from "lucide-react";

export default function EmptyState({
  hasSearchQuery,
}: {
  hasSearchQuery: boolean;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-subtle flex items-center justify-center">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">
        {hasSearchQuery ? "Категории не найдены" : "Нет доступных категорий"}
      </p>
    </div>
  );
}
