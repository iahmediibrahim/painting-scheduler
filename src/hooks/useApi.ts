'use client'

import {
	Availability,
	AvailabilityRequest,
	Booking,
	BookingRequest,
	Customer,
	Painter,
	User,
} from '@/types'

// API base URL - updated to use NestJS server port
const API_BASE_URL = 'http://localhost:3001/api'

// Token management functions
const getAuthToken = (): string | null => {
	// For client-side operations, we still need localStorage for API calls
	if (typeof window !== 'undefined') {
		return localStorage.getItem('auth_token')
	}
	return null
}

const setAuthToken = (token: string): void => {
	// Store in localStorage for API calls
	if (typeof window !== 'undefined') {
		localStorage.setItem('auth_token', token)
	}

	// Also set in cookie for middleware authentication
	document.cookie = `auth_token=${token}; path=/; max-age=${
		7 * 24 * 60 * 60
	}; SameSite=Lax`
}

const clearAuthToken = (): void => {
	// Clear from localStorage
	if (typeof window !== 'undefined') {
		localStorage.removeItem('auth_token')
	}

	// Clear from cookies
	document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
}

// Helper for authenticated requests
const authFetch = async (
	url: string,
	options: RequestInit = {},
): Promise<Response> => {
	const token = getAuthToken()
	const headers = {
		...options.headers,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}

	return fetch(url, { ...options, headers })
}

// API client for making requests to the NestJS server
export const api = {
	// Auth token management
	getAuthToken,
	setAuthToken,
	clearAuthToken,

	// Auth endpoints
	async login(
		email: string,
		password: string,
	): Promise<{ accessToken: string; user: User }> {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.message || 'Login failed')
		}

		// Return the data directly without setting token here
		// Token will be set in useUser hook
		return {
			accessToken: data.accessToken,
			user: data.user,
		}
	},

	async signup(userData: {
		name: string
		email: string
		password: string
		role: string
	}): Promise<{ accessToken: string; user: User }> {
		const response = await fetch(`${API_BASE_URL}/auth/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.message || 'Signup failed')
		}

		// Return the data directly without setting token here
		// Token will be set in useUser hook
		return {
			accessToken: data.accessToken,
			user: data.user,
		}
	},

	async logout(): Promise<void> {
		clearAuthToken()
	},

	// User endpoints
	async getUsersByType(type: 'painter' | 'customer'): Promise<User[]> {
		const response = await authFetch(`${API_BASE_URL}/users?role=${type}`)
		if (!response.ok) {
			throw new Error('Failed to fetch users')
		}
		return response.json()
	},

	async getPainters(): Promise<Painter[]> {
		return (await this.getUsersByType('painter')) as Painter[]
	},

	async getUserById(id: string): Promise<User | undefined> {
		const response = await authFetch(`${API_BASE_URL}/users/${id}`)
		if (!response.ok) {
			if (response.status === 404) {
				return undefined
			}
			throw new Error('Failed to fetch user')
		}
		return response.json()
	},

	// Availability endpoints
	async getPainterAvailability(painterId: string): Promise<Availability[]> {
		const response = await authFetch(`${API_BASE_URL}/availabilities`)
		if (!response.ok) {
			throw new Error('Failed to fetch painter availability')
		}
		return response.json()
	},

	async getAllAvailabilities(): Promise<Availability[]> {
		const response = await authFetch(`${API_BASE_URL}/availabilities`)
		if (!response.ok) {
			throw new Error('Failed to fetch all availabilities')
		}
		return response.json()
	},

	async addAvailability(
		availability: AvailabilityRequest,
	): Promise<Availability> {
		const response = await authFetch(`${API_BASE_URL}/availabilities`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				startTime: availability.startTime,
				endTime: availability.endTime,
			}),
		})
		if (!response.ok) {
			throw new Error('Failed to add availability')
		}
		return response.json()
	},

	// Booking endpoints
	async createBooking(bookingData: BookingRequest): Promise<Booking> {
		const response = await authFetch(`${API_BASE_URL}/bookings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				startTime: bookingData.startTime,
				endTime: bookingData.endTime,
				customerId: bookingData.customerId,
				painterId: bookingData.preferredPainterId,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			// If there's a closest available slot in the error response, include it
			if (data.closestAvailableSlot) {
				const error = new Error(
					data.message || 'Failed to create booking',
				) as Error & {
					closestAvailableSlot?: any
				}
				error.closestAvailableSlot = data.closestAvailableSlot
				throw error
			}
			throw data
		}
		return data
	},

	async getCustomerBookings(
		customerId: string,
	): Promise<(Booking & { painter: Painter })[]> {
		const response = await authFetch(`${API_BASE_URL}/bookings`)
		if (!response.ok) {
			throw new Error('Failed to fetch customer bookings')
		}
		return response.json()
	},

	async getPainterBookings(
		painterId: string,
	): Promise<(Booking & { customer: Customer })[]> {
		const response = await authFetch(`${API_BASE_URL}/bookings`)
		if (!response.ok) {
			throw new Error('Failed to fetch painter bookings')
		}
		return response.json()
	},

	async updateBookingStatus(
		bookingId: string,
		status: string,
	): Promise<Booking> {
		const response = await authFetch(
			`${API_BASE_URL}/bookings/${bookingId}/status`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			},
		)

		if (!response.ok) {
			throw new Error('Failed to update booking status')
		}

		return response.json()
	},

	async cancelBooking(bookingId: string): Promise<Booking> {
		const response = await authFetch(`${API_BASE_URL}/bookings/${bookingId}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error('Failed to cancel booking')
		}

		return response.json()
	},

	async getBookingDetails(bookingId: string): Promise<Booking> {
		const response = await authFetch(`${API_BASE_URL}/bookings/${bookingId}`)

		if (!response.ok) {
			throw new Error('Failed to fetch booking details')
		}

		return response.json()
	},
}
