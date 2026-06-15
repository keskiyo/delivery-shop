'use client'

import { AlertTriangle, X } from 'lucide-react'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'

type ConfirmVariant = 'default' | 'danger' | 'warning' | 'success'

interface ConfirmOptions {
	title?: string
	description: string
	confirmText?: string
	cancelText?: string
	variant?: ConfirmVariant
}

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

const variantClasses: Record<ConfirmVariant, string> = {
	default: 'bg-brand hover:bg-brand-hover',
	danger: 'bg-danger hover:bg-danger/90',
	warning: 'bg-warning hover:bg-warning/90',
	success: 'bg-brand hover:bg-brand-hover',
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
	const [options, setOptions] = useState<ConfirmOptions | null>(null)
	const resolverRef = useRef<((value: boolean) => void) | null>(null)

	const confirm = useCallback((nextOptions: ConfirmOptions) => {
		setOptions({
			title: 'Подтвердите действие',
			confirmText: 'OK',
			cancelText: 'Отмена',
			variant: 'default',
			...nextOptions,
		})

		return new Promise<boolean>(resolve => {
			resolverRef.current = resolve
		})
	}, [])

	const close = useCallback((result: boolean) => {
		resolverRef.current?.(result)
		resolverRef.current = null
		setOptions(null)
	}, [])

	useEffect(() => {
		if (!options) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [close, options])

	return (
		<ConfirmContext.Provider value={confirm}>
			{children}
			{options && (
				<div className='fixed inset-0 z-300 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm'>
					<div className='w-full max-w-md overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-2xl'>
						<div className='flex items-start justify-between gap-4 border-b border-border px-5 py-4'>
							<div className='flex items-center gap-3'>
								<div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning'>
									<AlertTriangle className='size-5' />
								</div>
								<h2 className='text-lg font-semibold'>
									{options.title}
								</h2>
							</div>
							<button
								type='button'
								onClick={() => close(false)}
								className='rounded p-1 text-muted-foreground transition-custom hover:bg-surface-hover hover:text-foreground'
								aria-label='Закрыть'
							>
								<X className='size-5' />
							</button>
						</div>
						<div className='px-5 py-4'>
							<p className='text-sm leading-6 text-muted-foreground'>
								{options.description}
							</p>
						</div>
						<div className='flex justify-end gap-3 border-t border-border bg-surface-subtle px-5 py-4'>
							<button
								type='button'
								onClick={() => close(false)}
								className='rounded border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-custom hover:bg-surface-hover'
							>
								{options.cancelText}
							</button>
							<button
								type='button'
								onClick={() => close(true)}
								className={`rounded px-4 py-2 text-sm font-medium text-white transition-custom ${variantClasses[options.variant || 'default']}`}
							>
								{options.confirmText}
							</button>
						</div>
					</div>
				</div>
			)}
		</ConfirmContext.Provider>
	)
}

export const useConfirm = () => {
	const confirm = useContext(ConfirmContext)

	if (!confirm) {
		throw new Error('useConfirm must be used within ConfirmProvider')
	}

	return confirm
}
