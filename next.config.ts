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
			// Temporary article images uploaded from the editor
			{
				pathname: '/temp/**',
			},
			// Static uploaded images from the public folder
			{
				pathname: '/uploads/**',
			},
			// Article images served through API routes
			{
				pathname: '/api/uploads/**',
			},
			// Category images uploaded from the CMS
			{
				pathname: '/blogCategories/**',
			},
			// Static SVG icons rendered through next/image
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
