/**
 * Контейнер (Container) - базовая обертка для контента страниц
 * 
 * Задаёт ширину и отступы:
 * - max-w-7xl: максимальная ширина 1280px (80rem = 1280px)
 * - px-4: отступы по бокам 16px на мобильных
 * - mx-auto: центрирование по горизонтали
 * 
 * @param children - Дочерние элементы
 * @param className - Дополнительные CSS классы
 * 
 * @example
 * <Container>
 *   <h1>Заголовок</h1>
 *   <p>Контент...</p>
 * </Container>
 */
import React from 'react'

interface ContainerProps {
	children: React.ReactNode
	className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
	return (
		<div
			className={`
        w-full 
        mx-auto 
        px-4        /* Отступы от краев на мобильных */
        max-w-7xl /* Максимальная ширина 1280 px */
        ${className}
      `}
		>
			{children}
		</div>
	)
}

export default Container
