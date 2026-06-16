import { Metadata } from 'next'
import { baseUrl } from '../../../../utils/baseUrl'
import { ContactsContent } from './ContactsContent'

export const metadata: Metadata = {
	title: 'Контакты | Фудмаркет - адреса магазинов и телефоны',
	description:
		'Контакты компании Фудмаркет. Адреса магазинов в Архангельске, телефоны бухгалтерии, склада и отдела лояльности. Схема проезда и часы работы.',
	keywords:
		'контакты, Фудмаркет, адреса магазинов, телефоны, Архангельск, бухгалтерия, склад, карта проезда, система лояльности',
	alternates: {
		canonical: `${baseUrl}/contacts`,
	},
	openGraph: {
		title: 'Контакты | Фудмаркет',
		description:
			'Адреса магазинов и контактные телефоны компании Фудмаркет',
		url: `${baseUrl}/contacts`,
		siteName: 'Фудмаркет',
		images: {
			url: '/og-images/contacts-og.jpg',
			width: 512,
			height: 512,
			alt: 'Контакты Фудмаркет',
		},
	},
}

export default function ContactsPage() {
	return <ContactsContent />
}
