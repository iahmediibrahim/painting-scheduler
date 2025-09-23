'use client'

import { User } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/localStorageService'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { api } from './useApi'

const CURRENT_USER_KEY = 'painting-scheduler-current-user'

export function useUser() {
	const [currentUser, setCurrentUser] = useState<User | null>(null)

	// Load user from localStorage on initial render
	useEffect(() => {
		const savedUser = getFromStorage<User | null>(CURRENT_USER_KEY, null)
		if (savedUser) {
			setCurrentUser(savedUser)
		}
	}, [])

	// Save user to localStorage when it changes
	useEffect(() => {
		if (currentUser) {
			saveToStorage(CURRENT_USER_KEY, currentUser)
		}
	}, [currentUser])

	const { data: painters = [] } = useQuery({
		queryKey: ['users', 'painter'],
		queryFn: () => api.getUsersByType('painter'),
		enabled: true,
	})

	const { data: customers = [] } = useQuery({
		queryKey: ['users', 'customer'],
		queryFn: () => api.getUsersByType('customer'),
		enabled: true,
	})

	const getUserById = async (id: string): Promise<User | undefined> => {
		try {
			return await api.getUserById(id)
		} catch (error) {
			console.error('Error fetching user:', error)
			return undefined
		}
	}

	// Enhanced setCurrentUser that also saves to localStorage
	const setCurrentUserWithStorage = (user: User | null) => {
		setCurrentUser(user)
		if (user) {
			saveToStorage(CURRENT_USER_KEY, user)
		} else {
			localStorage.removeItem(CURRENT_USER_KEY)
		}
	}

	return {
		currentUser,
		setCurrentUser: setCurrentUserWithStorage,
		painters,
		customers,
		getUserById,
	}
}
