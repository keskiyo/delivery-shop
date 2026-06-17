import { Metadata } from 'next'
import { baseUrl } from '../../../../utils/baseUrl'
import { ContactsContent } from './ContactsContent'

export const metadata: Metadata = {
	title: 'Контакты | Фудмаркета - адреса магазинов и телефоны',
	description:
		'Контакты компании Фудмаркета. Адреса магазинов в Архангельске, телефоны бухгалтерии, склада и отдела лояльности. Схема проезда и часы работы.',
	keywords:
		'контакты, Фудмаркета, адреса магазинов, телефоны, Архангельск, бухгалтерия, склад, карта проезда, система лояльности',
	alternates: {
		canonical: `${baseUrl}/contacts`,
	},
	openGraph: {
		title: 'Контакты | Фудмаркета',
		description:
			'Адреса магазинов и контактные телефоны компании Фудмаркета',
		url: `${baseUrl}/contacts`,
		siteName: 'Фудмаркета',
		images: {
			url: '/og-images/contacts-og.jpg',
			width: 512,
			height: 512,
			alt: 'Контакты Фудмаркета',
		},
	},
}

export default function ContactsPage() {
	return <ContactsContent />
}
