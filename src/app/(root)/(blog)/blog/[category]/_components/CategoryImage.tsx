import Image from "next/image";
import { CategoryImageProps } from "../../types";

const CategoryImage = ({
  category,
  gradientColor,
  hasImage,
}: CategoryImageProps) => {
  if (hasImage && category.image) {
    return (
      <div className="relative mx-auto h-52 w-full max-w-xl overflow-hidden rounded-md border border-border bg-card shadow-(--shadow-default) sm:h-64">
        <Image
          src={category.image}
          alt={category.imageAlt || category.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, 576px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-52 w-full items-center justify-center overflow-hidden rounded-md border border-border bg-linear-to-br shadow-(--shadow-default) sm:h-64 ${gradientColor}`}
    >
      <div className="max-w-2xl px-6 text-center text-white">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">{category.name}</h2>
        {category.description && (
          <p className="text-base leading-7 text-white/90 sm:text-lg">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryImage;
