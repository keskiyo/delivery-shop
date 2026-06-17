'use client'

import { ItemsPerPageSelector } from '@/app/(root)/(admin)/administrator/_components/ItemPerPageSelector'
import { Pagination } from '@/app/(root)/(admin)/administrator/_components/Pagination'
import { useConfirm } from '@/components/ui/confirm/ConfirmProvider'
import { useCommentsStore } from '@/store/commentsStore'
import { useEffect, useState } from 'react'
import { Header } from '../_components/Header'
import { CommentsFilters } from './_components/CommentsFilters'
import CommentsList from './_components/CommentsList'
import CommentsTableHeader from './_components/CommentsTableHeader'

const CommentsPage = () => {
	const confirmDialog = useConfirm()
	const {
		comments,
		totalPages,
		currentPage,
		loading,
		totalAllItems,
		itemsPerPage,
		setItemsPerPage,
		loadComments,
		setCurrentPage,
	} = useCommentsStore()

	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [activeFilter, setActiveFilter] = useState<string>('')
	const [authorFilter, setAuthorFilter] = useState('')
	const [articleFilter, setArticleFilter] = useState('')

	useEffect(() => {
		loadComments({
			page: currentPage,
			dateFrom: dateFrom || undefined,
			dateTo: dateTo || undefined,
			author: authorFilter || undefined,
			article: articleFilter || undefined,
		})
	}, [
		currentPage,
		dateFrom,
		dateTo,
		authorFilter,
		articleFilter,
		loadComments,
	])

	const handleItemsPerPageChange = (perPage: number) => {
		setItemsPerPage(perPage)
		setCurrentPage(1)
		loadComments({ page: 1 })
	}

	const handleDelete = async (commentId: string) => {
		const confirmed = await confirmDialog({
			title: 'Удалить комментарий',
			description: 'Удалить комментарий?',
			confirmText: 'Удалить',
			variant: 'danger',
		})

		if (!confirmed) return
		setDeletingId(commentId)
		try {
			const res = await fetch(
				`/administrator/cms/api/comments/${commentId}`,
				{
					method: 'DELETE',
				},
			)
			if (res.ok) {
				loadComments({ page: currentPage })
			}
		} catch (error) {
			console.error('Ошибка удаления:', error)
		} finally {
			setDeletingId(null)
		}
	}

	const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateFrom(e.target.value)
		setCurrentPage(1)
		setActiveFilter('')
	}

	const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateTo(e.target.value)
		setCurrentPage(1)
		setActiveFilter('')
	}

	const getTodayDate = () => {
		const today = new Date()
		return today.toISOString().split('T')[0]
	}

	const getDaysAgo = (days: number) => {
		const date = new Date()
		date.setDate(date.getDate() - days)
		return date.toISOString().split('T')[0]
	}

	const setToday = () => {
		const today = getTodayDate()
		setDateFrom(today)
		setDateTo(today)
		setCurrentPage(1)
		setActiveFilter('today')
	}

	const setLast3Days = () => {
		setDateFrom(getDaysAgo(3))
		setDateTo(getTodayDate())
		setCurrentPage(1)
		setActiveFilter('3days')
	}

	const setLastWeek = () => {
		setDateFrom(getDaysAgo(7))
		setDateTo(getTodayDate())
		setCurrentPage(1)
		setActiveFilter('week')
	}

	const setLastMonth = () => {
		setDateFrom(getDaysAgo(30))
		setDateTo(getTodayDate())
		setCurrentPage(1)
		setActiveFilter('month')
	}

	const clearFilters = () => {
		setDateFrom('')
		setDateTo('')
		setAuthorFilter('')
		setArticleFilter('')
		setCurrentPage(1)
		setActiveFilter('')
	}

	const applyFilters = (author: string, article: string) => {
		setAuthorFilter(author)
		setArticleFilter(article)
		setCurrentPage(1)
		loadComments({
			page: 1,
			dateFrom: dateFrom || undefined,
			dateTo: dateTo || undefined,
			author: author || undefined,
			article: article || undefined,
		})
	}

	return (
		<div className='relative'>
			<Header
				title='Управление комментариями'
				description={`Всего комментариев: ${totalAllItems}`}
			/>
			<div className='mb-4'>
				<ItemsPerPageSelector
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
				/>
			</div>
			<CommentsFilters
				dateFrom={dateFrom}
				dateTo={dateTo}
				activeFilter={activeFilter}
				authorFilter={authorFilter}
				articleFilter={articleFilter}
				onDateFromChange={handleDateFromChange}
				onDateToChange={handleDateToChange}
				onSetToday={setToday}
				onSetLast3Days={setLast3Days}
				onSetLastWeek={setLastWeek}
				onSetLastMonth={setLastMonth}
				onApplyFilters={applyFilters}
				onClearFilters={clearFilters}
				getTodayDate={getTodayDate}
			/>
			<CommentsTableHeader />
			<div className='p-4 border border-t-0 rounded-b border-border bg-card'>
				<CommentsList
					comments={comments}
					loading={loading}
					deletingId={deletingId}
					onDelete={handleDelete}
				/>
			</div>
			{totalPages > 1 && !loading && comments.length > 0 && (
				<Pagination type='comments' />
			)}
		</div>
	)
}

export default CommentsPage
