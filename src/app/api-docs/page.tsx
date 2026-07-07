'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

// Swagger UI грузится из CDN, чтобы не добавлять npm-пакет с React-peer-конфликтами.
// Локально разрешаем Try it out, на продакшене оставляем документацию read-only.

const SWAGGER_VERSION = '5.17.14'
const CSS_URL = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui.css`
const JS_URL = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui-bundle.js`
const SUBMIT_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

declare global {
	interface Window {
		SwaggerUIBundle?: (options: Record<string, unknown>) => unknown
	}
}

export default function ApiDocsPage() {
	const [scriptLoaded, setScriptLoaded] = useState(false)
	const initialized = useRef(false)

	useEffect(() => {
		if (!scriptLoaded || initialized.current) return
		if (typeof window === 'undefined' || !window.SwaggerUIBundle) return

		initialized.current = true
		const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)

		window.SwaggerUIBundle({
			url: '/api/docs',
			dom_id: '#swagger-ui',
			deepLinking: true,
			withCredentials: true,
			persistAuthorization: true,
			supportedSubmitMethods: isLocalHost ? SUBMIT_METHODS : [],
			requestInterceptor: (req: { credentials?: string }) => {
				req.credentials = 'include'
				return req
			},
		})
	}, [scriptLoaded])

	return (
		<>
			<link rel='stylesheet' href={CSS_URL} />
			<Script src={JS_URL} onLoad={() => setScriptLoaded(true)} />
			<div id='swagger-ui' style={{ background: '#fff', minHeight: '100vh' }} />
		</>
	)
}
