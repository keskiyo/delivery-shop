/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx,mdx}', // Для React/Vite
		'./pages/**/*.{js,ts,jsx,tsx}', // Для Next.js
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],

	theme: {
		// Расширяем ВСЕ критические значения, которые Tailwind удаляет без конфига
		extend: {
			// 1. Радиусы (главная проблема)
			borderRadius: {
				'2xl': '1rem', // Стандартный rounded-2xl
				'3xl': '1.5rem', // Дополнительные радиусы
				'4xl': '2rem',
				'5xl': '2.5rem',
				full: '9999px', // Важно для круглых элементов
			},

			// 2. Тени
			boxShadow: {
				'button-default': 'var(--shadow-button-default)',
				'button-secondary': 'var(--shadow-button-secondary)',
				'button-active': 'var(--shadow-button-active)',
			},

			// 3. Шрифты (часто ломаются без конфига)
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

			// 4. Отступы
			spacing: {
				128: '32rem',
				144: '36rem',
				160: '40rem',
				192: '48rem',
			},

			// 5. Z-index (для модальных окон и т.д.)
			zIndex: {
				50: '50',
				100: '100',
				200: '200',
				500: '500',
				1000: '1000',
			},
		},
	},

	// Важные плагины
	plugins: [
		require('@tailwindcss/forms'), // Для стилей форм
		require('tailwindcss-animate'), // Для анимаций (shadcn)
	],
}
