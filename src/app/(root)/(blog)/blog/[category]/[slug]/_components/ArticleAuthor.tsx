const ArticleAuthor = ({ author }: { author: string }) => {
	if (!author) {
		return null
	}

	return (
		<div className='mt-35 border-t border-border pt-6 text-muted-foreground'>
			<span className='italic'>Автор: {author}</span>
		</div>
	)
}

export default ArticleAuthor
