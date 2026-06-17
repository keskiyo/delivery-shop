module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],

	theme: {
		extend: {
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
				'5xl': '2.5rem',
				full: '9999px',
			},

			boxShadow: {
				'button-default': 'var(--shadow-button-default)',
				'button-secondary': 'var(--shadow-button-secondary)',
				'button-active': 'var(--shadow-button-active)',
			},

			fontSize: {
				xs: '0.75rem',
				sm: '0.875rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem',
				'6xl': '3.75rem',
				'7xl': '4.5rem',
				'8xl': '6rem',
				'9xl': '8rem',
			},

			spacing: {
				128: '32rem',
				144: '36rem',
				160: '40rem',
				192: '48rem',
			},

			zIndex: {
				50: '50',
				100: '100',
				200: '200',
				500: '500',
				1000: '1000',
			},
		},
	},

	plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}
