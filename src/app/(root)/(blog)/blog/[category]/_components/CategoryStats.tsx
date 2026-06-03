import { CategoryStatsProps } from "../../types";

const CategoryStats = ({
  totalArticles,
  currentPage,
  totalPages,
  articlesCount,
}: CategoryStatsProps) => {
  return (
    <div className="mt-2 flex flex-col items-start justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm sm:flex-row sm:items-center">
      <div className="text-foreground">
        <span className="font-semibold">Найдено статей:</span>{" "}
        <span className="font-bold text-brand">{totalArticles}</span>
      </div>
      <div className="text-muted-foreground">
        Страница {currentPage} из {totalPages} • Показано {articlesCount} из{" "}
        {totalArticles}
      </div>
    </div>
  );
};

export default CategoryStats;
