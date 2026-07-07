'use client'

import { useEffect, useState } from 'react'
import {
	TelegramIcon,
	TelegramShareButton,
	VKIcon,
	VKShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from 'react-share'

const ShareButton = () => {
	const [url, setUrl] = useState('')
	const [title, setTitle] = useState('')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)

		if (typeof window !== 'undefined') {
			setUrl(window.location.href)
			setTitle(document.title)
		}
	}, [])

	if (!mounted) return null

	return (
		<div className='fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 rounded-bl-[100px] rounded-tl-[100px] bg-card px-2 py-9 shadow-lg md:block'>
			<div className='flex flex-col gap-3'>
				<TelegramShareButton
					url={url}
					title={title}
					className='transition-opacity hover:opacity-70'
				>
					<TelegramIcon size={24} round />
				</TelegramShareButton>

				<VKShareButton
					url={url}
					title={title}
					className='transition-opacity hover:opacity-70'
				>
					<VKIcon size={24} round />
				</VKShareButton>

				<WhatsappShareButton
					url={url}
					title={title}
					className='transition-opacity hover:opacity-70'
				>
					<WhatsappIcon size={24} round />
				</WhatsappShareButton>
			</div>
		</div>
	)
}

export default ShareButton
