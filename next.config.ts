import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
				pathname: '/blogCategories/**',
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
