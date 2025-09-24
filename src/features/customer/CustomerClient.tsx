'use client'

import { BookingsList, BookingDetailsModal, ConfirmationModal } from '@/features/shared'
import { useBookings } from '@/hooks/useBookings'
import { useUser } from '@/hooks/useUser'
import { Booking, BookingRequest, Customer, Painter } from '@/types'
import { useState } from 'react'
import {
	BookingForm,
	ClosestSlotSuggestion,
	CustomerDashboard,
} from './components'

interface ClosestSlot {
	startTime: string
	endTime: string
	message?: string
	painter?: Painter
}

export default function CustomerClient() {
	const { currentUser, painters } = useUser()
	const { bookings, createBooking, cancelBooking } = useBookings(currentUser)

	const [closestAvailableSlot, setClosestAvailableSlot] =
		useState<ClosestSlot | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
	const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

	const customerUser = currentUser as Customer | null
	
	const handleCancelBooking = (bookingId: string) => {
		setBookingToCancel(bookingId);
		setIsConfirmModalOpen(true);
	}
	
	const confirmCancelBooking = () => {
		if (bookingToCancel) {
			cancelBooking.mutate(bookingToCancel);
		}
	}
	
	const handleViewDetails = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsDetailsModalOpen(true);
	}

	const handleBookingAttempt = (
		error: Error | null,
		closestSlot: ClosestSlot | null,
	) => {
		if (error) {
			setError(error.message || 'Failed to create booking')
			console.log('error', error)

			// Only set closestAvailableSlot if it's not null
			if (closestSlot) {
				setClosestAvailableSlot(closestSlot)
			}
		} else {
			setError(null)
			// Don't immediately clear the closest slot suggestion on success
			// This allows users to see and interact with it
		}
	}

	const handleUseClosestSlot = () => {
		if (!closestAvailableSlot || !customerUser) return

		const bookingData: Partial<Booking> = {
			customerId: customerUser.id,
			startTime: closestAvailableSlot.startTime,
			endTime: closestAvailableSlot.endTime,
			painterId: closestAvailableSlot.painter?.id || '',
		}

		createBooking.mutate(bookingData as BookingRequest, {
			onSuccess: () => {
				setClosestAvailableSlot(null)
				setError(null)
			},
			onError: (error: Error) => {
				setError(error.message || 'Failed to create booking')
			},
		})
	}

	if (!currentUser) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-4 mt-6 shadow-sm">
					<div className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-amber-600 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="text-amber-800 font-medium">
							Loading customer information...
						</p>
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className="container mx-auto px-4 py-8">
			{customerUser && <CustomerDashboard customer={customerUser} />}

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
					<p className="text-red-700 font-medium">{error}</p>
				</div>
			)}

			<ClosestSlotSuggestion
				closestSlot={closestAvailableSlot}
				onUseSlot={handleUseClosestSlot}
			/>

			<div className="mt-6 space-y-8 animate-fadeIn">
				{customerUser && (
					<BookingForm
						customer={customerUser}
						painters={painters as Painter[]}
						createBooking={createBooking}
						onBookingAttempt={handleBookingAttempt}
					/>
				)}

				<section className="bg-white shadow-md rounded-lg p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
						<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
							{bookings.length} bookings
						</span>
					</div>
					<BookingsList 
						bookings={bookings} 
						userType="customer" 
						onCancel={handleCancelBooking}
						onViewDetails={handleViewDetails}
					/>
					
					<BookingDetailsModal
						booking={selectedBooking}
						isOpen={isDetailsModalOpen}
						onClose={() => setIsDetailsModalOpen(false)}
					/>
					
					<ConfirmationModal
						isOpen={isConfirmModalOpen}
						onClose={() => setIsConfirmModalOpen(false)}
						onConfirm={confirmCancelBooking}
						title="Cancel Booking"
						message="Are you sure you want to cancel this booking? This action cannot be undone."
						confirmText="Yes, Cancel Booking"
						cancelText="No, Keep Booking"
					/>
				</section>
			</div>
		</div>
	)
}
