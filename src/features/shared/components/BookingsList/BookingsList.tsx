'use client'
import { Booking } from '@/types'
import { formatDateTimeRange, formatTime } from '@/utils/dateFormatter'
import { getStatusColor } from '@/utils/helpers'

interface BookingsListProps {
	bookings: Booking[]
	userType: 'painter' | 'customer'
}

export function BookingsList({
	bookings,
	userType,
	onStatusChange,
	onCancel,
	onViewDetails,
}: BookingsListProps & {
	onStatusChange?: (bookingId: string, status: string) => void
	onCancel?: (bookingId: string) => void
	onViewDetails?: (booking: Booking) => void
}) {
	if (bookings.length === 0) {
		return (
			<div className="col-span-full text-center py-8">
				<p className="text-gray-500">No bookings found.</p>
				<p className="text-sm text-gray-400 mt-1">
					{userType === 'customer'
						? 'Book a painter using the form above.'
						: 'Bookings will appear here when customers book your services.'}
				</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{bookings.map((booking) => {
				const statusColors = getStatusColor(booking.status)
				const borderColor = statusColors.split(' ')[0].replace('text', 'border')

				return (
					<div
						key={booking.id}
						className={`border-l-4 ${borderColor} ${
							statusColors.split(' ')[1]
						} rounded-lg p-4`}
					>
						<p className="font-medium text-gray-800 mb-2">
							👤{' '}
							{userType === 'painter' && booking.customer
								? booking.customer.name
								: userType === 'customer' && booking.painter
								? booking.painter.name
								: 'Unknown'}
						</p>
						<p className="text-sm text-gray-600 mb-1">
							📅 {formatDateTimeRange(booking.startTime, booking.endTime)}
						</p>
						<p className="text-sm text-gray-600 mb-1">
							⏰ {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
						</p>
						<div className="mt-2 pt-2 border-t border-blue-200">
							<p className={`text-xs ${statusColors.split(' ')[0]}`}>
								Status:{' '}
								<span className="font-semibold">
									{booking.status || 'Pending'}
								</span>
							</p>

							<div className="mt-3 flex flex-wrap gap-2">
								{onViewDetails && (
									<button
										onClick={() => onViewDetails(booking)}
										className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
									>
										View Details
									</button>
								)}

								{userType === 'painter' &&
									onStatusChange &&
									booking.status?.toUpperCase() !== 'CANCELLED' &&
									booking.status?.toUpperCase() !== 'COMPLETED' && (
										<>
											{booking.status?.toUpperCase() !== 'COMPLETED' && (
												<button
													onClick={() =>
														onStatusChange(booking.id, 'COMPLETED')
													}
													className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded"
												>
													Mark Completed
												</button>
											)}
											{booking.status?.toUpperCase() === 'PENDING' && (
												<button
													onClick={() =>
														onStatusChange(booking.id, 'ACCEPTED')
													}
													className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
												>
													Confirm
												</button>
											)}
										</>
									)}

								{onCancel &&
									booking.status?.toUpperCase() !== 'COMPLETED' &&
									booking.status?.toUpperCase() !== 'CANCELLED' && (
										<button
											onClick={() => onCancel(booking.id)}
											className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
										>
											Cancel
										</button>
									)}
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
