import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogCategoryItemProps } from "../types/sidebar.types";

export default function CategoryItem({
  category,
  index,
  onClick,
}: BlogCategoryItemProps) {
  return (
    <Link href={`/blog/categories/${category.slug}`} onClick={onClick}>
      <div
        className="group p-4 my-1 rounded-xl border border-border hover:border-brand hover:bg-brand-soft duration-300 hover:shadow-md animate-slide-in"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <h3 className="font-medium text-foreground group-hover:text-brand">
                {category.name}
              </h3>
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            )}
            {category.articleCount !== undefined && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-soft text-brand">
                  {category.articleCount} статей
                </span>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 duration-300" />
        </div>
      </div>
    </Link>
  );
}
