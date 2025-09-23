'use client'
import { Booking } from '@/types'
import { formatDateTimeRange, formatTime } from '@/utils/dateFormatter'

interface BookingsListProps {
	bookings: Booking[]
	userType: 'painter' | 'customer'
}

export function BookingsList({ bookings, userType }: BookingsListProps) {
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
			{bookings.map((booking) => (
				<div
					key={booking.id}
					className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4"
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
						<p className="text-xs text-blue-700">
							Status: <span className="font-semibold">Confirmed</span>
						</p>
					</div>
				</div>
			))}
		</div>
	)
}
