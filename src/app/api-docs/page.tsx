'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

// Настоящий Swagger UI из swagger-ui-dist по CDN — без npm-пакета и React-peer-конфликтов
// (React 19 + Next 16). Спека берётся из /api/docs. Cookie-сессия better-auth уходит в
// «Try it out» за счёт withCredentials + requestInterceptor (credentials: 'include').

const SWAGGER_VERSION = '5.17.14'
const CSS_URL = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui.css`
const JS_URL = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui-bundle.js`

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
		window.SwaggerUIBundle({
			url: '/api/docs',
			dom_id: '#swagger-ui',
			deepLinking: true,
			withCredentials: true,
			persistAuthorization: true,
			requestInterceptor: (req: { credentials?: string }) => {
				req.credentials = 'include'
				return req
			},
		})
	}, [scriptLoaded])

	return (
		<>
			{/* eslint-disable-next-line @next/next/no-css-tags */}
			<link rel='stylesheet' href={CSS_URL} />
			<Script src={JS_URL} onLoad={() => setScriptLoaded(true)} />
			<div id='swagger-ui' style={{ background: '#fff', minHeight: '100vh' }} />
		</>
	)
}
