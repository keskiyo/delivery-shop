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
		<div className='fixed bg-card top-1/2 -translate-y-1/2 right-0 px-2 py-9 z-50 rounded-bl-[100px] rounded-tl-[100px] shadow-lg'>
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
