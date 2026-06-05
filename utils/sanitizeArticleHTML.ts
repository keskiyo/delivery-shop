// Назначение: утилита sanitizeArticleHTML.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const createDOMPurify = () => {
	const window = new JSDOM('').window
	return DOMPurify(window)
}

const purify = createDOMPurify()

export function stripArticleBackgroundStyles(html: string): string {
	if (!html) return ''

	const dom = new JSDOM(`<body>${html}</body>`)
	const { document } = dom.window

	document.querySelectorAll<HTMLElement>('[style]').forEach(element => {
		const safeStyles = element
			.getAttribute('style')!
			.split(';')
			.map(rule => rule.trim())
			.filter(Boolean)
			.filter(rule => {
				const property = rule.split(':')[0]?.trim().toLowerCase()
				return property !== 'background' && property !== 'background-color'
			})

		if (safeStyles.length > 0) {
			element.setAttribute('style', safeStyles.join('; '))
		} else {
			element.removeAttribute('style')
		}
	})

	return document.body.innerHTML
}

export function sanitizeArticleHTML(html: string): string {
	if (!html) return ''

	const htmlWithoutBackground = stripArticleBackgroundStyles(html)

	return purify.sanitize(htmlWithoutBackground, {
		ALLOWED_TAGS: [
			'p',
			'br',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'strong',
			'b',
			'em',
			'i',
			'u',
			's',
			'mark',
			'code',
			'blockquote',
			'pre',
			'ul',
			'ol',
			'li',
			'a',
			'img',
			'table',
			'thead',
			'tbody',
			'tr',
			'th',
			'td',
			'span',
			'div',
		],

		ALLOWED_ATTR: [
			'href',
			'target',
			'rel',
			'title',
			'src',
			'alt',
			'title',
			'width',
			'height',
			'class',
			'style',
			'colspan',
			'rowspan',
			'border',
			'cellpadding',
			'cellspacing',
			'class',
			'style',
			'id',
		],

		FORBID_TAGS: [
			'script',
			'iframe',
			'object',
			'embed',
			'form',
			'input',
			'textarea',
			'button',
			'select',
			'meta',
			'link',
			'style',
			'base',
		],

		FORBID_ATTR: [
			'onerror',
			'onload',
			'onclick',
			'onmouseover',
			'onmouseout',
			'onfocus',
			'onblur',
			'onchange',
			'onsubmit',
			'onkeydown',
			'onkeyup',
			'onkeypress',
		],

		ALLOW_DATA_ATTR: false,
		ALLOW_UNKNOWN_PROTOCOLS: false,
		USE_PROFILES: { html: true },
	})
}
