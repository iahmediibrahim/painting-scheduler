'use client'

import { Button, Card, CardBody, CardHeader } from '@/features/shared'
import { BookingRequest, Customer, Painter } from '@/types'
import { formatDateTimeForInput } from '@/utils/dateFormatter'
import { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface ClosestSlot {
	startTime: string
	endTime: string
	message?: string
	painter?: Painter
}

interface BookingFormProps {
	customer: Customer
	painters: Painter[]
	createBooking: UseMutationResult<
		{ id: string; painterId: string; startTime: string; endTime: string },
		Error,
		BookingRequest
	>
	onBookingAttempt: (
		error: Error | null,
		closestSlot: ClosestSlot | null,
	) => void
}

interface BookingFormData {
	startTime: string
	endTime: string
	preferredPainterId?: string
}

export default function BookingForm({
	customer,
	painters,
	createBooking,
	onBookingAttempt,
}: BookingFormProps) {
	const [formData, setFormData] = useState<BookingFormData>({
		startTime: '',
		endTime: '',
		preferredPainterId: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleBookSlot = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!customer) return

		setIsSubmitting(true)

		try {
			await createBooking.mutateAsync({
				customerId: customer.id,
				startTime: formData.startTime,
				endTime: formData.endTime,
				preferredPainterId: formData.preferredPainterId || undefined,
			})

			toast.success('Booking created successfully!')
			onBookingAttempt(null, null)

			// Reset form
			setFormData({
				startTime: '',
				endTime: '',
				preferredPainterId: '',
			})
		} catch (error) {
			if (error instanceof Error) {
				const errorWithSlot = error as Error & {
					closestAvailableSlot?: ClosestSlot
				}
				onBookingAttempt(error, errorWithSlot.closestAvailableSlot || null)
			} else {
				onBookingAttempt(error as Error, null)
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Card className="mb-8 transform transition-all hover:translate-y-[-2px]">
			<CardHeader>
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
						Book a Painter
					</h2>
				</div>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleBookSlot} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Start Time:
							</label>
							<input
								type="datetime-local"
								value={formData.startTime}
								onChange={(e) =>
									setFormData({ ...formData, startTime: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
								min={formatDateTimeForInput(new Date())}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								End Time:
							</label>
							<input
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) =>
									setFormData({ ...formData, endTime: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
								min={formData.startTime}
								required
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Preferred Painter (Optional):
						</label>
						<select
							value={formData.preferredPainterId || ''}
							onChange={(e) =>
								setFormData({
									...formData,
									preferredPainterId: e.target.value || undefined,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
						>
							<option value="">Any Available Painter</option>
							{painters.map((painter) => (
								<option key={painter.id} value={painter.id}>
									{painter.name} - {painter.specialty} (⭐ {painter.rating})
								</option>
							))}
						</select>
					</div>
					<Button
						type="submit"
						variant="primary"
						disabled={isSubmitting}
						className="px-6 py-2"
					>
						{isSubmitting ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Booking...
							</>
						) : (
							'Book Slot'
						)}
					</Button>
				</form>
			</CardBody>
		</Card>
	)
}
