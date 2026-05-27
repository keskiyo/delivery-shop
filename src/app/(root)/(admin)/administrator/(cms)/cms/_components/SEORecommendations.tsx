import { CheckCircle2 } from 'lucide-react'

export const SEORecommendations = ({
	recommendations,
}: {
	recommendations: string[]
}) => {
	return (
		<div className='mt-6 p-4 bg-brand-soft rounded-lg'>
			<h3 className='font-semibold text-brand mb-2'>
				Рекомендации по SEO:
			</h3>
			<ul className='text-sm text-text-soft space-y-2'>
				{recommendations.map((rec, index) => (
					<li key={index} className='flex items-start gap-2'>
						<CheckCircle2 className='h-4 w-4 text-brand mt-0.5 shrink-0' />
						<span>{rec}</span>
					</li>
				))}
			</ul>
		</div>
	)
}
