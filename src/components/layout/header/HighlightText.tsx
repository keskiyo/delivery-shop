/**
 * Компонент подсветки текста в результатах поиска
 * 
 * Функционал:
 * - Выделяет совпадающие символы жирным шрифтом
 * - Регистронезависимый поиск (gi флаг)
 * 
 * @param text - Полный текст (например, название товара)
 * @param highlight - Поисковый запрос для подсветки
 * 
 * @example
 * <HighlightText text="Свежая говядина" highlight="говя" />
 * // Результат: "Свежая <span class="font-bold">говя</span>дина"
 * 
 * Используется в:
 * - SearchResults.tsx (подсветка товаров и категорий)
 */
export default function HighlightText({
	text,
	highlight,
}: {
	text: string
	highlight: string
}) {
	if (!highlight.trim()) return <>{text}</>
	const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

	return (
		<span>
			{parts.map((part, i) =>
				part.toLowerCase() === highlight.toLowerCase() ? (
					<span key={i} className='font-bold'>
						{part}
					</span>
				) : (
					part
				),
			)}
		</span>
	)
}
