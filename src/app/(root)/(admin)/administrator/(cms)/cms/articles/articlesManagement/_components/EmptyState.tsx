import { useArticlesManagementStore } from "@/store/articlesManagementStore";

export const EmptyState = () => {
  const { searchQuery } = useArticlesManagementStore();
  return (
    <div className="p-8 text-center text-muted-foreground">
      {searchQuery
        ? "Ничего не найдено по Вашему запросу"
        : "Статей пока нет"}
    </div>
  );
};
