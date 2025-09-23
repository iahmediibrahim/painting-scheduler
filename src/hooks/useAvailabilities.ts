'use client'

import { AvailabilityRequest, User } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'

export function useAvailabilities(currentUser: User | null) {
  const queryClient = useQueryClient()

  const { data: availabilities = [] } = useQuery({
    queryKey: ['availabilities', currentUser?.id],
    queryFn: () => {
      if (!currentUser || currentUser.type !== 'painter') return []
      return api.getPainterAvailability(currentUser.id)
    },
    enabled: !!currentUser && currentUser.type === 'painter',
  })

  const addAvailability = useMutation({
    mutationFn: (availability: AvailabilityRequest) =>
      api.addAvailability(availability),
    onSuccess: () => {
      // Invalidate queries to refetch data
      if (currentUser?.type === 'painter') {
        queryClient.invalidateQueries({
          queryKey: ['availabilities', currentUser.id],
        })
      }
    },
  })

  return {
    availabilities,
    addAvailability
  }
}