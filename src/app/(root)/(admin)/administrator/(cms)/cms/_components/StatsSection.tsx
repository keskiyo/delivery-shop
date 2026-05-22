import { StatItem } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/StatItem'
import { StatsSkeleton } from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/StatsSkeleton'
import { useSiteSettings } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useSiteSettings'
import { useStatsValues } from '@/app/(root)/(admin)/administrator/(cms)/cms/hooks/useStatsValues'
import { getStatValue } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/getStatValue'
import { stats } from '../utils/stats'

export const StatsSection = () => {
	const { keywordsCount } = useStatsValues()
	const { loading: settingsLoading } = useSiteSettings()

	const loading = settingsLoading

	if (loading) return <StatsSkeleton />
	return (
		<div className='bg-card rounded-xl shadow-md border border-gray-200 p-6'>
			<h2 className='text-xl font-semibold mb-6'>Общая статистика</h2>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				{stats.map((stat, index) => (
					<StatItem
						key={index}
						stat={stat}
						statValue={getStatValue(
							stat.title,
							keywordsCount.toString(),
						)}
					/>
				))}
			</div>
		</div>
	)
}
