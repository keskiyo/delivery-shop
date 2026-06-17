import { IComment } from "../../types/comments.types";

export const getAuthorBadges = (comment: IComment) => {
  const badges = [];

  if (comment.authorRole === "admin") {
    badges.push({
      text: "Админ",
      className: "bg-danger-soft text-danger border border-danger/30",
    });
  } else if (comment.authorRole === "manager") {
    badges.push({
      text: "Менеджер",
      className: "bg-success-soft text-success border border-success/30",
    });
  }
  return badges;
};
