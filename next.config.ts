import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		qualities: [100, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 75],
	},
}

export default nextConfig
