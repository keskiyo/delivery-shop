'use client'

/**
 * Слайдер баннеров на главной странице
 * 
 * Функционал:
 * - Автоматическое переключение слайдов каждые 5 секунд
 * - Использует framer-motion для анимации (fade + scale)
 * - Бесконечный цикл (repeat: Infinity)
 * 
 * Слайды:
 * - SlideOne: баннер с акциями
 * - SlideTwo: баннер с доставкой
 * 
 * Анимация:
 * - Плавное появление/исчезновение (opacity 0->1->1->0)
 * - Легкий поворот по X оси (rotateX 0->2)
 * - Длительность: 5 секунд на слайд
 * 
 * Используется на:
 * - Главной странице (src/app/(root)/page.tsx)
 */
import { motion } from 'framer-motion'
import SlideOne from './SlideOne'
import SlideTwo from './SlideTwo'

const Slider = () => {
	const slides = [<SlideOne key='slide1' />, <SlideTwo key='slide2' />]

	return (
		<div className='relative h-20 md:h-40 xl:h-60 w-full'>
			{slides.map((slide, index) => (
				<motion.div
					key={`slide-${index}`}
					initial={{
						opacity: 0,
						scale: 1,
					}}
					animate={{
						opacity: [0, 1, 1, 0],
						rotateX: [0, 0, 0, 2],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						repeatDelay: slides.length * 5 - 5,
						delay: index * 5,
						ease: [0.165, 0.84, 0.44, 1],
					}}
					className='absolute w-full h-full'
					style={{
						willChange: 'transform, opacity, filter',
						backfaceVisibility: 'hidden',
					}}
				>
					{slide}
				</motion.div>
			))}
		</div>
	)
}

export default Slider
