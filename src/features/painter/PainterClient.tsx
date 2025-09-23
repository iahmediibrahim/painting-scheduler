'use client'

import { Badge, BookingsList, UserSelector } from '@/features/shared'
import { useAvailabilities } from '@/hooks/useAvailabilities'
import { useBookings } from '@/hooks/useBookings'
import { useUser } from '@/hooks/useUser'
import { Painter, User } from '@/types'
import {
	AvailabilityForm,
	AvailabilityList,
	PainterDashboard,
} from './components'

export default function PainterClient() {
	const { currentUser, setCurrentUser } = useUser()
	const { availabilities, addAvailability } = useAvailabilities(currentUser)
	const { bookings } = useBookings(currentUser)

	const painterUser = currentUser as Painter | null

	const handleUserChange = (user: User) => {
		setCurrentUser(user)
	}

	if (!currentUser) {
		return (
			<div className="container mx-auto px-4 py-8">
				<UserSelector onUserChange={handleUserChange} />
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
							Please select a painter to continue.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<UserSelector onUserChange={handleUserChange} currentUser={currentUser} />

			<div className="mt-6 space-y-8 animate-fadeIn">
				{painterUser && <PainterDashboard painter={painterUser} />}

				{painterUser && (
					<AvailabilityForm
						painter={painterUser}
						addAvailability={addAvailability}
					/>
				)}

				<AvailabilityList availabilities={availabilities} />

				<section className="bg-white shadow-md rounded-lg p-6 transform transition-all hover:translate-y-[-2px]">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-indigo-600 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
								/>
							</svg>
							<h2 className="text-xl font-semibold text-gray-800">
								Assigned Bookings
							</h2>
						</div>
						<Badge variant="success">{bookings.length} bookings</Badge>
					</div>
					<BookingsList bookings={bookings} userType="painter" />
				</section>
			</div>
		</div>
	)
}
