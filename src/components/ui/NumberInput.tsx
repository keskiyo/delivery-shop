'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import {
	forwardRef,
	InputHTMLAttributes,
	MouseEvent,
	useImperativeHandle,
	useRef,
} from 'react'

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	wrapperClassName?: string
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
	(
		{ className = '', wrapperClassName = '', disabled, readOnly, ...props },
		ref,
	) => {
		const inputRef = useRef<HTMLInputElement>(null)
		const resolvedWrapperClassName = wrapperClassName || 'w-full'

		useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

		const changeByStep = (
			direction: 'increment' | 'decrement',
			event: MouseEvent<HTMLButtonElement>,
		) => {
			event.preventDefault()

			const input = inputRef.current
			if (!input || disabled || readOnly) return

			if (direction === 'increment') {
				input.stepUp()
			} else {
				input.stepDown()
			}

			input.dispatchEvent(new Event('input', { bubbles: true }))
		}

		return (
			<div
				className={`relative flex items-center ${resolvedWrapperClassName}`}
			>
				<input
					{...props}
					ref={inputRef}
					type='number'
					disabled={disabled}
					readOnly={readOnly}
					className={`${className} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&&]:pr-10`}
				/>
				<div className='pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-1'>
					<button
						type='button'
						tabIndex={-1}
						aria-label='Увеличить значение'
						disabled={disabled || readOnly}
						onMouseDown={event => changeByStep('increment', event)}
						className='pointer-events-auto flex size-4 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
					>
						<ChevronUp className='size-3' strokeWidth={2.5} />
					</button>
					<button
						type='button'
						tabIndex={-1}
						aria-label='Уменьшить значение'
						disabled={disabled || readOnly}
						onMouseDown={event => changeByStep('decrement', event)}
						className='pointer-events-auto flex size-4 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
					>
						<ChevronDown className='size-3' strokeWidth={2.5} />
					</button>
				</div>
			</div>
		)
	},
)

NumberInput.displayName = 'NumberInput'

export default NumberInput
