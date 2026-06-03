// Назначение: пункты меню CMS.
// Как работает: Хранит ссылки, подписи и иконки навигации администратора.

import { FileText, FolderTree, Home, Plus, Tags } from 'lucide-react'

export const menuItems = [
	{
		id: 'cms-home',
		title: 'CMS',
		description: 'Главная страница управления контентом',
		icon: <Home className='w-6 h-6' />,
		shadow: 'shadow-lg shadow-gray-500/20',
		path: '/administrator/cms',
	},
	{
		id: 'new-article',
		title: 'Новая статья',
		description: 'Создать статью в редакторе',
		icon: <Plus className='w-6 h-6' />,
		shadow: 'shadow-lg shadow-blue-500/20',
		path: '/administrator/cms/articles/editor',
	},
	{
		id: 'all-articles',
		title: 'Все статьи',
		description: 'Просмотр и управление статьями',
		icon: <FileText className='w-6 h-6' />,
		shadow: 'shadow-lg shadow-indigo-500/20',
		path: '/administrator/cms/all-articles',
	},
	{
		id: 'categories',
		title: 'Категории',
		description: 'Управление категориями блога',
		icon: <FolderTree className='w-6 h-6' />,
		shadow: 'shadow-lg shadow-green-500/20',
		path: '/administrator/cms/categories',
	},
	{
		id: 'semantic-core',
		title: 'Семантическое ядро',
		description: 'Ключевые слова и SEO',
		icon: <Tags className='w-6 h-6' />,
		shadow: 'shadow-lg shadow-purple-500/20',
		path: '/administrator/cms/semantic-core',
	},
]
