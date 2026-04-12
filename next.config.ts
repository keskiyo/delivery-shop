import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		localPatterns: [
			// Avatar API - omit 'search' to allow any query params (?t=...)
			{
				pathname: '/api/auth/avatar/**',
			},
			// All static images in public folder
			{
				pathname: '/images/**',
			},
		],
	},
}

export default nextConfig
