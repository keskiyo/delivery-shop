


import { FileText, FolderTree, MessageSquare, Plus, Tags } from 'lucide-react'
import { DashboardCard } from '../types/dashboard'

export const dashboardCards: DashboardCard[] = [
	{
		id: 'new-article',
		title: 'Новая статья',
		description: 'Создать статью в редакторе',
		icon: <Plus className='w-6 h-6' />,
		colors: {
			iconBg: 'bg-brand-soft',
			iconText: 'text-brand',
			buttonBg: 'bg-brand',
		},
		path: '/administrator/cms/articles/editor',
		actionText: 'Создать',
	},
	{
		id: 'all-articles',
		title: 'Все статьи',
		description: 'Просмотр и управление статьями',
		icon: <FileText className='w-6 h-6' />,
		colors: {
			iconBg: 'bg-brand-soft',
			iconText: 'text-brand',
			buttonBg: 'bg-brand',
		},
		path: '/administrator/cms/articles/articlesManagement',
		actionText: 'Перейти',
	},
	{
		id: 'categories',
		title: 'Категории',
		description: 'Управление категориями блога',
		icon: <FolderTree className='w-6 h-6' />,
		colors: {
			iconBg: 'bg-success-soft',
			iconText: 'text-success',
			buttonBg: 'bg-success',
		},
		path: '/administrator/cms/categories',
		actionText: 'Управлять',
	},
	{
		id: 'semantic-core',
		title: 'Семантическое ядро',
		description: 'Ключевые слова и SEO',
		icon: <Tags className='w-6 h-6' />,
		colors: {
			iconBg: 'bg-promo-soft',
			iconText: 'text-promo',
			buttonBg: 'bg-promo',
		},
		path: '/administrator/cms/semantic-core',
		actionText: 'Настроить',
	},
	{
		id: 'comments',
		title: 'Управление комментариями',
		description: 'Проверка комментариев и управление пользователями',
		icon: <MessageSquare className='w-6 h-6' />,
		colors: {
			iconBg: 'bg-surface-hover',
			iconText: 'text-text-soft',
			buttonBg: 'bg-brand',
		},
		path: '/administrator/cms/comments',
		actionText: 'Проверить',
	},
]
