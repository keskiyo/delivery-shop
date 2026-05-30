"use client";

import { showPromiseToast } from "@/lib/showToast";
import { useEffect } from "react";
import { Header } from "../../_components/Header";
import { ItemsPerPageSelector } from "../../categories/_components/ItemPerPageSelector";
import { Pagination } from "../../_components/Pagination";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { Article } from "./types";
import { ArticleTable } from "./_components/ArticleTable";
import { useArticlesReorder } from "./hooks/useArticlesReorder";

const ArticlesManagementPage = () => {
  const {
    totalAllItems,
    totalPages,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    setIsReordering,
  } = useArticlesManagementStore();

  const { loadArticles, reorderArticles } = useArticlesReorder();

  useEffect(() => {
    loadArticles({ page: currentPage });
  }, [currentPage, loadArticles]);

  const handleReorder = async (reorderedCategories: Article[]) => {
    setIsReordering(true);

    try {
      const dataForApi = reorderedCategories.map((category) => ({
        _id: category._id.toString(),
        numericId: category.numericId || 0,
      }));

      await showPromiseToast(
        (async () => {
          const result = await reorderArticles(dataForApi);
          if (!result.success) {
            throw new Error(result.message || "Ошибка обновления порядка");
          }
          return result;
        })(),
        {
          pending: "Обновляем порядок статей...",
          success: "Порядок статей успешно обновлен",
          error: "Ошибка обновления порядка",
        },
      );

    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    } finally {
      setIsReordering(false);
    }
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
    loadArticles({ page: 1 });
  };

  return (
    <div className="relative">
      <Header
        title="Управление статьями"
        description={`Всего статей: ${totalAllItems}`}
      />
      <div className="mb-4">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-sm text-muted-foreground mt-1">
          Текущие параметры: страница {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
      <ArticleTable onReorder={handleReorder} />
      {totalPages > 1 && <Pagination type="articles" />}
    </div>
  );
};

export default ArticlesManagementPage;
