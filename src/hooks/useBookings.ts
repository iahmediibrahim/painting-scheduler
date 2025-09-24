'use client'

import { Booking, BookingRequest, User } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from './useApi'

export function useBookings(currentUser: User | null) {
	const queryClient = useQueryClient()

	// Define the return type explicitly to handle both painter and customer bookings
	const { data: bookings = [] } = useQuery<Booking[]>({
		queryKey: ['bookings', currentUser?.id, currentUser?.role],
		queryFn: async () => {
			if (!currentUser) return []
			return currentUser.role.toLowerCase() === 'customer'
				? api.getCustomerBookings(currentUser.id)
				: api.getPainterBookings(currentUser.id)
		},
		enabled: !!currentUser,
	})

	// Invalidate painter and customer bookings on page load
	useEffect(() => {
		if (currentUser) {
			queryClient.invalidateQueries({
				queryKey: ['bookings', currentUser.id, currentUser.role.toLowerCase()],
			})
		}
	}, [currentUser, queryClient])

	const createBooking = useMutation({
		mutationFn: (bookingData: BookingRequest) => api.createBooking(bookingData),
		onSuccess: () => {
			// Invalidate relevant queries to refetch data
			// Force refetch all booking queries regardless of user role
			queryClient.invalidateQueries({
				queryKey: ['bookings'],
				refetchType: 'all',
			})

			// Also invalidate specific user's bookings
			if (currentUser) {
				queryClient.invalidateQueries({
					queryKey: [
						'bookings',
						currentUser.id,
						currentUser.role.toLowerCase(),
					],
					refetchType: 'all',
				})

				// For painters, also invalidate availabilities
				if (currentUser.role.toLowerCase() === 'painter') {
					queryClient.invalidateQueries({
						queryKey: ['availabilities', currentUser.id],
						refetchType: 'all',
					})
				}
			}
		},
	})

	const updateBookingStatus = useMutation({
		mutationFn: ({
			bookingId,
			status,
		}: {
			bookingId: string
			status: string
		}) => api.updateBookingStatus(bookingId, status.toUpperCase()),
		onSuccess: () => {
			// Invalidate ALL booking queries to ensure UI updates without refresh
			queryClient.invalidateQueries({
				queryKey: ['bookings'],
				refetchType: 'all',
			})
			
			// Also invalidate user-specific queries
			if (currentUser) {
				queryClient.invalidateQueries({
					queryKey: [
						'bookings',
						currentUser.id,
						currentUser.role.toLowerCase(),
					],
					refetchType: 'all',
				})
			}
		},
	})

	const cancelBooking = useMutation({
		mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
		onSuccess: () => {
			// Invalidate all booking queries to refresh the data
			queryClient.invalidateQueries({
				queryKey: ['bookings'],
				refetchType: 'all',
			})
			
			if (currentUser) {
				queryClient.invalidateQueries({
					queryKey: [
						'bookings',
						currentUser.id,
						currentUser.role.toLowerCase(),
					],
					refetchType: 'all',
				})
				
				// For painters, also invalidate availabilities
				if (currentUser.role.toLowerCase() === 'painter') {
					queryClient.invalidateQueries({
						queryKey: ['availabilities', currentUser.id],
						refetchType: 'all',
					})
				}
			}
		},
	})

	return {
		bookings,
		createBooking,
		updateBookingStatus,
		cancelBooking,
	}
}
