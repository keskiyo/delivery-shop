import { Search } from "lucide-react";
import { SidebarSearchInputProps } from "../types/sidebar.types";

export default function SearchInput({
  value,
  onChange,
}: SidebarSearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск категорий..."
        className="w-full pl-12 pr-4 py-3 bg-input text-foreground placeholder:text-muted-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand duration-300"
        autoFocus
      />
    </div>
  );
}
