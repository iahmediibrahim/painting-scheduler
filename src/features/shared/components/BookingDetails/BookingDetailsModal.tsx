'use client'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useUser } from '@/hooks/useUser'
import { Booking } from '@/types'
import { formatDateTimeRange, formatTime } from '@/utils/dateFormatter'
import { getStatusColor } from '@/utils/helpers'

interface BookingDetailsModalProps {
	booking: Booking | null
	isOpen: boolean
	onClose: () => void
}

export function BookingDetailsModal({
	booking,
	isOpen,
	onClose,
}: BookingDetailsModalProps) {
	const { currentUser } = useUser()
	if (!booking) return null

	return (
		<Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Booking Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 mt-4">
					{currentUser?.role.toLocaleLowerCase() === 'customer' && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-sm font-medium text-gray-500">Painter</h3>
								<p className="mt-1 text-sm text-gray-900">
									{booking.painter?.name || 'N/A'}
								</p>
							</div>
						</div>
					)}

					<div>
						<h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
						<p className="mt-1 text-sm text-gray-900">
							{formatDateTimeRange(booking.startTime, booking.endTime)}
						</p>
						<p className="text-sm text-gray-600">
							{formatTime(booking.startTime)} - {formatTime(booking.endTime)}
						</p>
					</div>

					{booking.address && (
						<div>
							<h3 className="text-sm font-medium text-gray-500">Address</h3>
							<p className="mt-1 text-sm text-gray-900">{booking.address}</p>
						</div>
					)}

					{booking.description && (
						<div>
							<h3 className="text-sm font-medium text-gray-500">Description</h3>
							<p className="mt-1 text-sm text-gray-900">
								{booking.description}
							</p>
						</div>
					)}

					<div>
						<h3 className="text-sm font-medium text-gray-500">Status</h3>
						<div className="mt-1">
							<span
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
									booking.status,
								)}`}
							>
								{booking.status || 'Pending'}
							</span>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
						<p className="mt-1 text-sm text-gray-900 font-mono">{booking.id}</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
