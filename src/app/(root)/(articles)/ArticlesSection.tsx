import ArticleCard from '@/app/(root)/(articles)/ArticleCard'
import ViewAllLink from '@/components/shared/ViewAllLink'
import { ArticlesSectionsProps } from '@/types/articlesSections'

const ArticlesSection = ({
	title,
	viewAllLink,
	articles,
	compact = false,
}: ArticlesSectionsProps) => {
	return (
		<section>
			<div
				className={`flex flex-col ${
					!compact ? 'px-[max(12px,calc((100%-1208px)/2))] mt-20' : ''
				}`}
			>
				<div className='mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between'>
					<h2 className='text-2xl xl:text-4xl text-left font-bold'>
						{title}
					</h2>
					<ViewAllLink
						href={viewAllLink.href}
						btnText={viewAllLink.text}
					/>
				</div>

				<ul className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
					{articles.map((article, index) => (
						<li
							key={article._id}
							className={`h-75 md:h-105 ${index >= 3 ? 'hidden' : ''}`}
						>
							<ArticleCard {...article} />
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}

export default ArticlesSection
