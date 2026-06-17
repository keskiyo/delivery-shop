import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/images/products/:path*',
				destination: '/api/uploads/products/:path*',
			},
			{
				source: '/uploads/:path*',
				destination: '/api/uploads/:path*',
			},
		]
	},
	reactCompiler: true,
	images: {
		localPatterns: [
			{
				pathname: '/api/auth/avatar/**',
			},

			{
				pathname: '/images/**',
			},

			{
				pathname: '/temp/**',
			},

			{
				pathname: '/uploads/**',
			},

			{
				pathname: '/api/uploads/**',
			},

			{
				pathname: '/blog-categories/**',
			},

			{
				pathname: '/icons-footer/**',
			},
			{
				pathname: '/icons-orders/**',
			},
		],
	},
}

export default nextConfig
