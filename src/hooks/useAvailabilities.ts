'use client'

import { AvailabilityRequest, User } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'

export function useAvailabilities(currentUser: User | null) {
	const queryClient = useQueryClient()

	const { data: availabilities = [], isLoading } = useQuery({
		queryKey: ['availabilities', currentUser?.id],
		queryFn: () => {
			if (!currentUser || currentUser.role.toLowerCase() !== 'painter')
				return []
			// Updated to use the new endpoint that returns all availabilities for the authenticated user
			return api.getPainterAvailability(currentUser.id)
		},
		enabled: !!currentUser && currentUser.role.toLowerCase() === 'painter',
	})

	const addAvailability = useMutation({
		mutationFn: (availability: AvailabilityRequest) =>
			api.addAvailability(availability),
		onSuccess: () => {
			// Invalidate queries to refetch data
			if (currentUser?.role.toLowerCase() === 'painter') {
				queryClient.invalidateQueries({
					queryKey: ['availabilities', currentUser.id],
					exact: false,
				})
			}
		},
	})

	return {
		isLoading,
		availabilities,
		addAvailability,
	}
}
