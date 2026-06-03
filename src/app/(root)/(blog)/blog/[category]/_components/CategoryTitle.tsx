"use client";

import { useCategoryTitles } from "@/app/contexts/CategoryContext";
import { useEffect } from "react";

const CategoryTitle = ({ categoryTitle }: { categoryTitle: string }) => {
  const { setCategoryTitle } = useCategoryTitles();
  useEffect(() => {
    setCategoryTitle(categoryTitle);

    return () => {
      setCategoryTitle("");
    };
  }, [categoryTitle, setCategoryTitle]);

  return (
    <h1 className="mb-0 text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
      {categoryTitle}
    </h1>
  );
};

export default CategoryTitle;
