import React, { useEffect, useRef, useState } from "react";
import { ArticleStatus, MobileExpandableContentProps } from "../types";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { getStatusStyles } from "../utils/getStatusStyles";
import {
  Check,
  ChevronDown,
  Eye,
  Star,
  User,
  Calendar,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const MobileExpandableContent = ({
  article,
}: MobileExpandableContentProps) => {
  const { updateArticleStatus, updateArticleFeatured } =
    useArticlesManagementStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/administrator/cms/articles/editor?id=${article._id}`);
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    setIsDropdownOpen(false);
    try {
      await updateArticleStatus(article._id.toString(), newStatus);
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
    }
  };

  const handleFeaturedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateArticleFeatured(article._id.toString(), !article.isFeatured);
    } catch (error) {
      console.error("Ошибка изменения избранности:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusInfo = getStatusStyles(article.status);
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleFeaturedToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer  transition-custom ${
            article.isFeatured
              ? "bg-warning text-white hover:bg-warning/90"
              : "bg-surface-hover hover:bg-surface-pressed"
          }`}
          title={
            article.isFeatured ? "Убрать из избранного" : "Добавить в избранное"
          }
        >
          <Star
            className={`w-5 h-5 ${
              article.isFeatured
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {article.views}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">просмотров</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer  transition-custom ${statusInfo.className}`}
            title={`Статус: ${statusInfo.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <span className="text-xs font-medium">{statusInfo.label}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform transition-custom ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 min-w-[140px] border border-border rounded-lg shadow-lg bg-card z-10 overflow-hidden">
              {(
                ["published", "draft", "archived", "deleted"] as ArticleStatus[]
              ).map((status) => {
                const statusStyle = getStatusStyles(status);
                return (
                  <button
                    key={status}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:brightness-95 cursor-pointer  ${
                      article.status === status ? "brightness-95" : ""
                    } ${statusStyle.className}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                  >
                    <span>{statusStyle.label}</span>
                    {article.status === status && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-surface-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Автор</span>
          </div>
          <div className="text-sm font-semibold text-foreground truncate">
            {article.author || <span className="text-muted-foreground">Не указан</span>}
          </div>
        </div>

        <div className="bg-surface-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Создана</span>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {formattedDate}
          </div>
        </div>
      </div>

      <div className="flex gap-5 pt-2 justify-center">
        {article.status !== "deleted" && (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center w-8 h-8 bg-brand text-white rounded-lg hover:bg-brand-hover cursor-pointer  transition-custom shadow-sm hover:shadow"
            title="Редактировать статью"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {article.status === "published" && (
          <Link
            href={`/blog/${article.categorySlug}/${article.slug}`}
            target="_blank"
            className="flex items-center justify-center w-8 h-8 bg-site-chrome text-white rounded-lg hover:bg-site-chrome/90 cursor-pointer  transition-custom shadow-sm hover:shadow"
            title="Просмотреть статью на сайте"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
