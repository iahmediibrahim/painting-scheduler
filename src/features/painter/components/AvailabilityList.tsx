'use client'

import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	SectionHeader,
} from '@/features/shared'
import { formatDate, formatTime } from '@/utils/dateFormatter'

interface Availability {
	id: string
	painterId: string
	startTime: string
	endTime: string
}

interface AvailabilityListProps {
	availabilities: Availability[]
}

export function AvailabilityList({ availabilities }: AvailabilityListProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<SectionHeader
					title="My Availability"
					badgeCount={availabilities.length}
					badgeText={`${availabilities.length} slots`}
				/>
			</CardHeader>
			<CardBody>
				{availabilities.length === 0 ? (
					<div className="text-center py-6">
						<p className="text-gray-500">No availability slots added yet.</p>
					</div>
				) : (
					<div className="space-y-3">
						{availabilities.map((slot) => (
							<div
								key={slot.id}
								className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
							>
								<div className="flex justify-between items-center">
									<div>
										<h3 className="font-medium text-gray-800">
											{formatDate(new Date(slot.startTime))} -{' '}
											{formatDate(new Date(slot.endTime))}
										</h3>
										<p className="text-gray-600">
											{formatTime(new Date(slot.startTime))} -{' '}
											{formatTime(new Date(slot.endTime))}
										</p>
									</div>
									<Badge variant="success">Available</Badge>
								</div>
							</div>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	)
}
