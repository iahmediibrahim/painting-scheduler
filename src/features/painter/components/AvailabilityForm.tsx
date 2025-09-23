'use client'

import { Button, Card, CardBody, CardHeader, Input } from '@/features/shared'
import { AvailabilityRequest, Painter } from '@/types'
import { formatDateTimeForInput } from '@/utils/dateFormatter'
import { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface AvailabilityFormProps {
	painter: Painter
	addAvailability: UseMutationResult<
		{ id: string; painterId: string; startTime: string; endTime: string },
		Error,
		AvailabilityRequest
	>
}

export default function AvailabilityForm({
	painter,
	addAvailability,
}: AvailabilityFormProps) {
	const [formData, setFormData] = useState({
		startTime: '',
		endTime: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			await addAvailability.mutate({
				painterId: painter.id,
				startTime: formData.startTime,
				endTime: formData.endTime,
			})
			setFormData({ startTime: '', endTime: '' })
			toast.success('Availability added successfully!')
		} catch (error) {
			toast.error('Failed to add availability')
			console.error('Error adding availability:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Card className="mb-8">
			<CardHeader>
				<h2 className="text-xl font-semibold text-gray-800">
					Add Availability
				</h2>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							type="datetime-local"
							label="Start Time"
							value={formData.startTime}
							onChange={(e) =>
								setFormData({ ...formData, startTime: e.target.value })
							}
							min={formatDateTimeForInput(new Date())}
							required
						/>
						<Input
							type="datetime-local"
							label="End Time"
							value={formData.endTime}
							onChange={(e) =>
								setFormData({ ...formData, endTime: e.target.value })
							}
							required
						/>
					</div>
					<Button
						type="submit"
						disabled={isSubmitting}
						icon={
							isSubmitting ? (
								<svg
									className="animate-spin h-4 w-4"
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
							) : null
						}
					>
						{isSubmitting ? 'Adding...' : 'Add Availability'}
					</Button>
				</form>
			</CardBody>
		</Card>
	)
}
