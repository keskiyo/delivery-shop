import { CategoryHeaderProps } from "../../types";
import CategoryTitle from "./CategoryTitle";

const CategoryHeader = ({ title, description }: CategoryHeaderProps) => {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <CategoryTitle categoryTitle={title} />
      {description && (
        <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </header>
  );
};

export default CategoryHeader;
