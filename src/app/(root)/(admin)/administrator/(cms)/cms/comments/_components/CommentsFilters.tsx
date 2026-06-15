import { useState } from "react";
import { Calendar, Search, User, FileText, X } from "lucide-react";
import { CommentsFiltersProps } from "../types/comments.types";

export const CommentsFilters = ({
  dateFrom,
  dateTo,
  activeFilter,
  authorFilter: initialAuthorFilter,
  articleFilter: initialArticleFilter,
  onDateFromChange,
  onDateToChange,
  onSetToday,
  onSetLast3Days,
  onSetLastWeek,
  onSetLastMonth,
  onApplyFilters,
  onClearFilters,
  getTodayDate,
}: CommentsFiltersProps) => {
  const [authorInput, setAuthorInput] = useState(initialAuthorFilter);
  const [articleInput, setArticleInput] = useState(initialArticleFilter);

  const handleApply = () => {
    onApplyFilters(authorInput, articleInput);
  };

  const handleClear = () => {
    setAuthorInput("");
    setArticleInput("");
    onClearFilters();
  };

  return (
    <div className="bg-card rounded shadow-sm border border-border p-5 mb-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Фильтр по дате</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={onSetToday}
            className={`px-4 py-2 text-sm rounded cursor-pointer transition-custom border ${
              activeFilter === "today"
                ? "bg-brand text-white border-success hover:bg-brand-hover"
                : "bg-surface text-foreground border-border hover:bg-surface-subtle"
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={onSetLast3Days}
            className={`px-4 py-2 text-sm rounded cursor-pointer transition-custom border ${
              activeFilter === "3days"
                ? "bg-brand text-white border-success hover:bg-brand-hover"
                : "bg-surface text-foreground border-border hover:bg-surface-subtle"
            }`}
          >
            3 дня
          </button>
          <button
            onClick={onSetLastWeek}
            className={`px-4 py-2 text-sm rounded cursor-pointer transition-custom border ${
              activeFilter === "week"
                ? "bg-brand text-white border-success hover:bg-brand-hover"
                : "bg-surface text-foreground border-border hover:bg-surface-subtle"
            }`}
          >
            Неделя
          </button>
          <button
            onClick={onSetLastMonth}
            className={`px-4 py-2 text-sm rounded cursor-pointer transition-custom border ${
              activeFilter === "month"
                ? "bg-brand text-white border-success hover:bg-brand-hover"
                : "bg-surface text-foreground border-border hover:bg-surface-subtle"
            }`}
          >
            Месяц
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-border">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">С</label>
            <input
              type="date"
              value={dateFrom}
              onChange={onDateFromChange}
              max={dateTo || getTodayDate()}
              className="px-3 py-2 border border-border bg-input rounded focus:ring-2 focus:ring-ring focus:border-success outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">По</label>
            <input
              type="date"
              value={dateTo}
              onChange={onDateToChange}
              min={dateFrom}
              max={getTodayDate()}
              className="px-3 py-2 border border-border bg-input rounded focus:ring-2 focus:ring-ring focus:border-success outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Поиск</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              <User className="w-4 h-4 inline mr-1" />
              По автору
            </label>
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Введите имя автора..."
              className="w-full px-4 py-2 border border-border bg-input rounded focus:ring-2 focus:ring-ring focus:border-success outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              По статье
            </label>
            <input
              type="text"
              value={articleInput}
              onChange={(e) => setArticleInput(e.target.value)}
              placeholder="Введите название статьи..."
              className="w-full px-4 py-2 border border-border bg-input rounded focus:ring-2 focus:ring-ring focus:border-success outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {(authorInput || articleInput || dateFrom || dateTo) && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border bg-card rounded hover:bg-surface-hover cursor-pointer transition-custom flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Сбросить все
            </button>
          )}
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-brand text-white rounded hover:bg-brand-hover cursor-pointer transition-custom flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
};
