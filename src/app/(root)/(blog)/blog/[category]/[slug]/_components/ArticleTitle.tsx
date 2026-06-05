'use client'

import { useArticleTitles } from '@/app/contexts/ArticleContext'
import { useCategoryTitles } from '@/app/contexts/CategoryContext'
import { useEffect } from 'react'
import { ArticleTitleProps } from '../../../types'

const ArticleTitle = ({ articleTitle, categoryName }: ArticleTitleProps) => {
	const { setArticleTitle } = useArticleTitles()
	const { setCategoryTitle } = useCategoryTitles()

	useEffect(() => {
		setArticleTitle(articleTitle)

		if (categoryName) {
			setCategoryTitle(categoryName)
		}

		return () => {
			setArticleTitle('')
			setCategoryTitle('')
		}
	}, [articleTitle, categoryName, setArticleTitle, setCategoryTitle])

	return (
		<h1 className='mb-4 text-3xl font-bold tracking-normal text-foreground sm:text-4xl'>
			{articleTitle}
		</h1>
	)
}

export default ArticleTitle
