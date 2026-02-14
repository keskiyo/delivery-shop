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
