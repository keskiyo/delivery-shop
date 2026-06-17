'use client'

import { Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { getColorFromName } from '../../../../../utils/getColorFromName'
import { SearchResult } from './types'

export default function BlogSearch() {
	const [searchTerm, setSearchTerm] = useState('')
	const [isSearching, setIsSearching] = useState(false)
	const [error, setError] = useState('')
	const [searchResults, setSearchResults] = useState<SearchResult>({
		articles: null,
	})
	const [showResults, setShowResults] = useState(false)

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()

		setIsSearching(true)
		setError('')

		try {
			const response = await fetch(
				`/api/blog/search?q=${encodeURIComponent(searchTerm)}`,
			)

			if (!response.ok) {
				throw new Error(`Ошибка поиска: ${response.status}`)
			}

			const data = await response.json()

			if (data.error) {
				setError(data.error)
				setSearchResults({ articles: null, searchTerm })
			} else {
				setSearchResults({
					articles: data.articles || [],
					searchTerm,
				})
				setShowResults(true)
			}
		} catch (err) {
			setError('Ошибка при выполнении поиска')
			console.error('Search error:', err)
			setSearchResults({ articles: null, searchTerm })
		} finally {
			setIsSearching(false)
		}
	}

	const handleClear = () => {
		setSearchTerm('')
		setError('')
		setSearchResults({ articles: null })
		setShowResults(false)
	}

	const closeResults = () => {
		setShowResults(false)
	}

	return (
		<div className='relative mb-8'>
			<div className='mx-auto max-w-2xl'>
				<form onSubmit={handleSubmit} className='relative'>
					<div className='flex gap-2'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
							<input
								type='text'
								value={searchTerm}
								onChange={e => {
									setSearchTerm(e.target.value)
									setError('')
								}}
								placeholder='Название или описание статьи'
								className='w-full text-xs md:text-base rounded border border-border bg-input py-3 pl-10 pr-10 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/30'
								disabled={isSearching}
							/>
							{searchTerm && (
								<button
									type='button'
									onClick={handleClear}
									className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-muted-foreground transition-custom hover:bg-surface-hover hover:text-foreground'
									aria-label='Очистить поиск'
								>
									<X className='h-5 w-5' />
								</button>
							)}
						</div>
						<button
							type='submit'
							disabled={
								isSearching || searchTerm.trim().length < 3
							}
							className='flex cursor-pointer items-center gap-2 rounded bg-brand px-6 py-3 text-white transition-custom hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50'
						>
							{isSearching ? (
								<>
									<div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
									<span>Поиск...</span>
								</>
							) : (
								<>
									<Search className='h-5 w-5' />
									<span>Найти</span>
								</>
							)}
						</button>
					</div>

					{error && (
						<p className='mt-2 text-sm text-danger'>{error}</p>
					)}

					{searchTerm.trim().length > 0 &&
						searchTerm.trim().length < 3 && (
							<p className='mt-2 text-sm text-warning-foreground'>
								Введите минимум 3 символа для поиска
							</p>
						)}
				</form>

				{showResults && searchResults.searchTerm && (
					<div className='mt-4'>
						<div className='overflow-hidden rounded border border-border bg-card shadow-default'>
							<div className='flex items-center justify-between border-b border-border bg-surface-subtle px-4 py-3'>
								<h3 className='font-semibold text-foreground'>
									{searchResults.articles === null
										? 'Ошибка поиска'
										: searchResults.articles.length === 0
											? `По запросу "${searchResults.searchTerm}" ничего не найдено`
											: `Найдено статей ${searchResults.articles.length} по запросу "${searchResults.searchTerm}"`}
								</h3>
								<button
									onClick={closeResults}
									className='cursor-pointer rounded p-1 text-muted-foreground transition-custom hover:bg-surface-hover hover:text-foreground'
									aria-label='Закрыть результаты'
								>
									<X className='h-5 w-5' />
								</button>
							</div>

							{searchResults.articles &&
								searchResults.articles.length > 0 && (
									<div className='max-h-96 divide-y divide-border overflow-y-auto'>
										{searchResults.articles.map(article => (
											<Link
												key={article._id}
												href={`/blog/${article.category?.slug}/${article.slug}`}
												className='block p-4 transition-custom hover:bg-surface-hover'
												onClick={closeResults}
											>
												<div className='flex items-start gap-3'>
													{article.image ? (
														<div className='relative h-16 w-16 shrink-0 overflow-hidden rounded border border-border bg-surface-subtle'>
															<Image
																src={
																	article.image
																}
																alt={
																	article.imageAlt ||
																	article.name
																}
																fill
																className='object-cover'
															/>
														</div>
													) : (
														<div
															className={`flex h-16 w-16 shrink-0 items-center justify-center rounded border border-border bg-linear-to-br ${getColorFromName(article.name)}`}
														></div>
													)}

													<div className='min-w-0 flex-1'>
														<h4 className='truncate font-medium text-foreground'>
															{article.name}
														</h4>

														{article.description && (
															<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
																{
																	article.description
																}
															</p>
														)}

														<div className='mt-2 flex items-center gap-3 text-xs text-muted-foreground'>
															{article.category
																?.name && (
																<span className='rounded bg-brand-soft px-2 py-1 text-brand'>
																	{
																		article
																			.category
																			.name
																	}
																</span>
															)}

															{article.publishedAt && (
																<span>
																	{new Date(
																		article.publishedAt,
																	).toLocaleDateString(
																		'ru-RU',
																	)}
																</span>
															)}
														</div>
													</div>
												</div>
											</Link>
										))}
									</div>
								)}

							{searchResults.articles &&
								searchResults.articles.length === 0 && (
									<div className='p-6 text-center'>
										<div className='mb-2 text-muted-foreground'>
											<Search className='mx-auto h-12 w-12' />
										</div>
										<p className='mb-2 text-foreground'>
											По запросу{' '}
											<span className='font-semibold'>
												&quot;{searchResults.searchTerm}
												&quot;
											</span>{' '}
											ничего не найдено
										</p>
										<p className='text-sm text-muted-foreground'>
											Попробуйте изменить запрос
										</p>
									</div>
								)}

							{searchResults.articles === null && (
								<div className='p-6 text-center'>
									<p className='mb-2 text-danger'>
										Произошла ошибка при поиске
									</p>
									<p className='text-sm text-muted-foreground'>
										Пожалуйста, попробуйте позже
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
