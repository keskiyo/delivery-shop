import { X, Folder } from "lucide-react";
import { SidebarHeaderProps } from "../types/sidebar.types";
import SearchInput from "./SearchInput";


export default function SidebarHeader({
  categoriesCount,
  onClose,
  searchQuery,
  onSearchChange,
}: SidebarHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand rounded-lg">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Все категории
            </h2>
            <p className="text-sm text-muted-foreground">
              {categoriesCount} разделов
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-hover rounded-lg cursor-pointer"
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <SearchInput value={searchQuery} onChange={onSearchChange} />
    </div>
  );
}
