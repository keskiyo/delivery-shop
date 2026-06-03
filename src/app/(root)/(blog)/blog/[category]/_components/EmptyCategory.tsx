const EmptyCategory = () => {
  return (
    <div className="py-12 text-center text-foreground">
      <div className="mx-auto max-w-xl rounded-md border border-border bg-card px-6 py-8 shadow-(--shadow-default)">
        <h2 className="mb-3 text-2xl font-bold">
          В этой категории пока нет статей
        </h2>
        <p className="text-muted-foreground">
          Загляните позже или посмотрите другие категории
        </p>
      </div>
    </div>
  );
};

export default EmptyCategory;
