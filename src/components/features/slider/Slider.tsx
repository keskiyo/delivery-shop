'use client'

import { motion } from 'framer-motion'
import SlideOne from './SlideOne'
import SlideTwo from './SlideTwo'

const Slider = () => {
	const slides = [<SlideOne key='slide1' />, <SlideTwo key='slide2' />]

	return (
		<div className='relative h-20 md:h-40 xl:h-80 w-full mb-10 md:mb-15 xl:mb-10'>
			{slides.map((slide, index) => (
				<motion.div
					key={`slide-${index}`}
					initial={{
						opacity: 0,
						scale: 0.98,
						filter: 'blur(4px)',
					}}
					animate={{
						opacity: [0, 1, 1, 0],
						scale: [0.98, 1, 1, 0.98],
						filter: [
							'blur(4px)',
							'blur(0px)',
							'blur(0px)',
							'blur(4px)',
						],
						rotateX: [0, 0, 0, 2],
						transformOrigin: 'center center',
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
