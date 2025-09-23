'use client'

import { Booking, BookingRequest, User } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from './useApi'

export function useBookings(currentUser: User | null) {
	const queryClient = useQueryClient()

	// Define the return type explicitly to handle both painter and customer bookings
	const { data: bookings = [] } = useQuery<Booking[]>({
		queryKey: ['bookings', currentUser?.id, currentUser?.type],
		queryFn: async () => {
			if (!currentUser) return []
			return currentUser.type === 'customer'
				? api.getCustomerBookings(currentUser.id)
				: api.getPainterBookings(currentUser.id)
		},
		enabled: !!currentUser,
	})

	// Invalidate painter bookings on page load
	useEffect(() => {
		if (currentUser && currentUser.type === 'painter') {
			queryClient.invalidateQueries({
				queryKey: ['bookings', currentUser.id, currentUser.type],
			})
		}
	}, [currentUser, queryClient])

	const createBooking = useMutation({
		mutationFn: (bookingData: BookingRequest) => api.createBooking(bookingData),
		onSuccess: () => {
			// Invalidate relevant queries to refetch data
			if (currentUser) {
				queryClient.invalidateQueries({
					queryKey: ['bookings', currentUser.id, currentUser.type],
				})
				if (currentUser.type === 'painter') {
					queryClient.invalidateQueries({
						queryKey: ['availabilities', currentUser.id],
					})
				}
			}
		},
	})

	return {
		bookings,
		createBooking,
	}
}
