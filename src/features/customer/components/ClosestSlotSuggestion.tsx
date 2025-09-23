import { Button, Card, CardBody } from '@/features/shared'
import { Painter } from '@/types'
import { formatDate, formatTime } from '@/utils/dateFormatter'

interface ClosestSlot {
	startTime: string
	endTime: string
	message?: string
	painter?: Painter
}

interface ClosestSlotSuggestionProps {
	closestSlot: ClosestSlot | null
	onUseSlot: () => void
}

export default function ClosestSlotSuggestion({
	closestSlot,
	onUseSlot,
}: ClosestSlotSuggestionProps) {
	if (!closestSlot) return null

	return (
		<Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 mb-6 transform transition-all hover:translate-y-[-2px]">
			<CardBody className="p-4">
				<div className="flex items-center mb-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-indigo-600 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clipRule="evenodd"
						/>
					</svg>
					<h3 className="font-medium text-indigo-800">
						No availability for your requested time
					</h3>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div className="mb-3 sm:mb-0">
						<div className="flex items-center text-sm text-indigo-700 mb-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{closestSlot.message ||
								`Closest available: ${formatDate(
									new Date(closestSlot.startTime),
								)} at ${formatTime(new Date(closestSlot.startTime))}`}
						</div>
						{closestSlot.painter && (
							<div className="flex items-center text-sm text-indigo-700">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Painter: {closestSlot.painter.name} (
								{closestSlot.painter.specialty})
							</div>
						)}
					</div>

					<Button
						onClick={onUseSlot}
						variant="primary"
						size="sm"
						className="transition-transform hover:scale-105"
					>
						Use This Slot
					</Button>
				</div>
			</CardBody>
		</Card>
	)
}
