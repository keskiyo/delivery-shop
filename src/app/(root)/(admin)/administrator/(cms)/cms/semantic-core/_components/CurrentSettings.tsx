import { SiteSettings } from '../../types/siteSettings'

interface CurrentSettingsProps {
	settings: SiteSettings
}

export default function CurrentSettings({ settings }: CurrentSettingsProps) {
	return (
		<div className='p-4 bg-card rounded-lg border border-gray-200 shadow-sm'>
			<h3 className='font-semibold mb-2'>Текущие настройки:</h3>
			<div className='text-sm space-y-1'>
				<div>
					<strong>Заголовок:</strong> {settings.siteTitle}
				</div>
				<div>
					<strong>Ключевых слов:</strong>{' '}
					{settings.siteKeywords?.length || 0}
				</div>
				<div>
					<strong>Тематик:</strong>{' '}
					{settings.semanticCore?.length || 0}
				</div>
				<div>
					<strong>Обновлено:</strong>{' '}
					{new Date(settings.updatedAt).toLocaleString('ru-RU')}
				</div>
			</div>
		</div>
	)
}
