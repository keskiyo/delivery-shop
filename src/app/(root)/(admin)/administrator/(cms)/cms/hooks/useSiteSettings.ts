


import { showPromiseToast } from '@/lib/showToast'
import { useEffect, useState } from 'react'
import { FormData, SiteSettings } from '../types/site-settings'

export const useSiteSettings = () => {
	const [settings, setSettings] = useState<SiteSettings | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [formData, setFormData] = useState<FormData>({
		siteTitle: '',
		metaDescription: '',
		siteKeywords: '',
		semanticCore: '',
	})

	const loadSettings = async () => {
		setLoading(true)

		try {
			const response = await fetch(`/administrator/cms/api/site-settings`)
			const data = await response.json()

			if (data.success) {
				setSettings(data.data)
				setFormData({
					siteTitle: data.data.siteTitle || '',
					metaDescription: data.data.metaDescription || '',
					siteKeywords: (data.data.siteKeywords || []).join(', '),
					semanticCore: (data.data.semanticCore || []).join(', '),
				})
			}
		} catch (error) {
			console.error('Ошибка загрузки настроек:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSettings()
	}, [])

	const handleSave = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setSaving(true)

		try {
			await showPromiseToast(
				(async () => {
					const response = await fetch(
						'/administrator/cms/api/site-settings',
						{
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								siteTitle: formData.siteTitle,
								metaDescription: formData.metaDescription,
								siteKeywords: formData.siteKeywords
									.split(',')
									.map(k => k.trim())
									.filter(k => k.length > 0),
								semanticCore: formData.semanticCore
									.split(',')
									.map(k => k.trim())
									.filter(k => k.length > 0),
							}),
						},
					)

					const data = await response.json()

					if (!data.success) {
						throw new Error('Ошибка сохранения')
					}

					return data
				})(),
				{
					pending: 'Сохраняем настройки...',
					success: 'Настройки сохранены',
					error: 'Ошибка сохранения настроек',
				},
			)
			await loadSettings()
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		} finally {
			setSaving(false)
		}
	}

	return {
		settings,
		loading,
		saving,
		formData,
		setFormData,
		handleSave,
		loadSettings,
	}
}
