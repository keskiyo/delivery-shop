/**
 * Компонент индикатора загрузки (Loader)
 * 
 * Отображает анимированный спиннер (круговая анимация):
 * - Серый круг (track) - фон
 * - Оранжевый круг (active) - анимированная часть
 * 
 * @param text - Опциональный текст для отображения (например, "товаров")
 * @param className - Дополнительные CSS классы
 * 
 * @example
 * <Loader /> // просто спиннер
 * <Loader text="товаров" /> // спиннер + "Загрузка товаров..."
 * <Loader className="mt-10" /> // с дополнительными стилями
 */
interface LoaderProps {
	text?: string
	className?: string
}

export const Loader = ({ text = '', className = '' }: LoaderProps) => (
	<div
		className={`flex flex-col items-center justify-center gap-3 pt-20 ${className}`}
	>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 384 384'
			className='loader'
		>
			<circle
				r='176'
				cy='192'
				cx='192'
				strokeWidth='32'
				fill='transparent'
				pathLength='360'
				className='active'
			></circle>
			<circle
				r='176'
				cy='192'
				cx='192'
				strokeWidth='32'
				fill='transparent'
				pathLength='360'
				className='track'
			></circle>
		</svg>
		{text && <p className='text-green-600'>Загрузка {text}...</p>}
	</div>
)
