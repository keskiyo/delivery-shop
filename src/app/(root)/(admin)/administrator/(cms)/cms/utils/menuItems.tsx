


import {
	FileText,
	FolderTree,
	Home,
	MessageSquare,
	Plus,
	Tags,
} from 'lucide-react'

export const menuItems = [
	{
		id: 'cms-home',
		title: 'CMS',
		description: 'Главная страница управления контентом',
		icon: <Home className='w-6 h-6' />,
		shadow: 'shadow-default',
		path: '/administrator/cms',
	},
	{
		id: 'new-article',
		title: 'Новая статья',
		description: 'Создать статью в редакторе',
		icon: <Plus className='w-6 h-6' />,
		shadow: 'shadow-default',
		path: '/administrator/cms/articles/editor',
	},
	{
		id: 'all-articles',
		title: 'Все статьи',
		description: 'Просмотр и управление статьями',
		icon: <FileText className='w-6 h-6' />,
		shadow: 'shadow-default',
		path: '/administrator/cms/articles/articlesManagement',
	},
	{
		id: 'categories',
		title: 'Категории',
		description: 'Управление категориями блога',
		icon: <FolderTree className='w-6 h-6' />,
		shadow: 'shadow-default',
		path: '/administrator/cms/categories',
	},
	{
		id: 'semantic-core',
		title: 'Семантическое ядро',
		description: 'Ключевые слова и SEO',
		icon: <Tags className='w-6 h-6' />,
		shadow: 'shadow-default',
		path: '/administrator/cms/semantic-core',
	},
	{
		id: 'comments',
		title: 'Комментарии',
		description: 'Управление комментариями',
		icon: <MessageSquare className='w-6 h-6' />,
		color: 'from-site-chrome to-surface-pressed',
		hoverColor: 'hover:from-surface-pressed hover:to-site-chrome',
		shadow: 'shadow-default',
		path: '/administrator/cms/comments',
	},
]
