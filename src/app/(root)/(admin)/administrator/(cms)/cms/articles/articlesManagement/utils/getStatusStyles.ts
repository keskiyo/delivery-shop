import { ArticleStatus } from "../types";

export const getStatusStyles = (status: ArticleStatus) => {
  switch (status) {
    case "published":
      return {
        className: "bg-success text-white border-success",
        label: "Опубликована",
      };
    case "draft":
      return {
        className: "bg-warning text-white border-warning",
        label: "Черновик",
      };
    case "archived":
      return {
        className: "bg-surface-pressed text-white border-border",
        label: "Архив",
      };
    case "deleted":
      return {
        className: "bg-danger text-white border-danger",
        label: "Удалена",
      };
    default:
      return {
        className: "bg-surface-pressed text-white border-border",
        label: status,
      };
  }
};
