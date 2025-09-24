'use client'

import { User } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/localStorageService'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { api } from './useApi'

const CURRENT_USER_KEY = 'painting-scheduler-current-user'

export function useUser() {
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Load user from localStorage on initial render
	useEffect(() => {
		setIsLoading(true)
		const savedUser = getFromStorage<User | null>(CURRENT_USER_KEY, null)
		if (savedUser) {
			setCurrentUser(savedUser)
		}

		// Check for auth token to ensure consistent state
		const token = api.getAuthToken()
		if (!savedUser && token) {
			// If we have a token but no user, clear the token
			api.clearAuthToken()
		} else if (savedUser && !token) {
			// If we have a user but no token, restore it from the saved user
			// This ensures API calls will work properly
			api.setAuthToken(savedUser.id) // Using ID as a simple token for now
		}

		// Set loading to false after user state is initialized
		setIsLoading(false)
	}, [])

	// Save user to localStorage when it changes
	useEffect(() => {
		if (currentUser) {
			saveToStorage(CURRENT_USER_KEY, currentUser)
		}
	}, [currentUser])

	const { data: painters = [] } = useQuery({
		queryKey: ['users', 'painter'],
		queryFn: () => api.getPainters(),
		enabled: true, // Enable the query to fetch painters
	})

	const { data: customers = [] } = useQuery({
		queryKey: ['users', 'customer'],
		queryFn: () => [], // Temporarily return empty array until backend endpoint is available
		enabled: false, // Disable this query for now
	})

	const getUserById = async (id: string): Promise<User | undefined> => {
		try {
			return await api.getUserById(id)
		} catch (error) {
			console.error('Error fetching user:', error)
			return undefined
		}
	}

	// Login function
	const login = async (email: string, password: string): Promise<User> => {
		try {
			const response = await api.login(email, password)
			const { user, accessToken } = response

			// Store the token and set current user
			api.setAuthToken(accessToken)
			setCurrentUser(user)

			// Redirect will be handled by the component
			return user
		} catch (error) {
			console.error('Login error:', error)
			throw error
		}
	}

	// Signup function
	const signup = async (userData: {
		name: string
		email: string
		password: string
		role: string
	}): Promise<User> => {
		try {
			const response = await api.signup(userData)
			const { user, accessToken } = response

			// Store the token and set current user
			api.setAuthToken(accessToken)
			setCurrentUser(user)

			// Redirect will be handled by the component
			return user
		} catch (error) {
			console.error('Signup error:', error)
			throw error
		}
	}

	// Logout function
	const logout = async (): Promise<void> => {
		try {
			await api.logout()
			// Clear user state
			setCurrentUser(null)
			// Clear from localStorage
			localStorage.removeItem(CURRENT_USER_KEY)
			// Ensure auth token is cleared
			api.clearAuthToken()
		} catch (error) {
			console.error('Logout error:', error)
			throw error
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
		login,
		signup,
		logout,
		isLoading,
	}
}
