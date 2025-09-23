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

// API base URL
const API_BASE_URL = 'http://localhost:3001/api'

// API client for making requests to the Express server
export const api = {
	// User endpoints
	async getUsersByType(type: 'painter' | 'customer'): Promise<User[]> {
		const response = await fetch(`${API_BASE_URL}/users?type=${type}`)
		if (!response.ok) {
			throw new Error('Failed to fetch users')
		}
		return response.json()
	},

	async getUserById(id: string): Promise<User | undefined> {
		const response = await fetch(`${API_BASE_URL}/users/${id}`)
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
		const response = await fetch(
			`${API_BASE_URL}/availability/me?painterId=${painterId}`,
		)
		if (!response.ok) {
			throw new Error('Failed to fetch painter availability')
		}
		return response.json()
	},

	async getAllAvailabilities(): Promise<Availability[]> {
		const response = await fetch(`${API_BASE_URL}/availability/all`)
		if (!response.ok) {
			throw new Error('Failed to fetch all availabilities')
		}
		return response.json()
	},

	async addAvailability(
		availability: AvailabilityRequest,
	): Promise<Availability> {
		const response = await fetch(`${API_BASE_URL}/availability`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(availability),
		})
		if (!response.ok) {
			throw new Error('Failed to add availability')
		}
		return response.json()
	},

	async findClosestAvailableSlot(requestedStart: string, requestedEnd: string) {
		const response = await fetch(
			`${API_BASE_URL}/availability/closest?start=${encodeURIComponent(
				requestedStart,
			)}&end=${encodeURIComponent(requestedEnd)}`,
		)
		if (!response.ok) {
			throw new Error('Failed to find closest available slot')
		}
		return response.json()
	},

	// Booking endpoints
	async createBooking(bookingData: BookingRequest): Promise<Booking> {
		const response = await fetch(`${API_BASE_URL}/bookings/request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(bookingData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw data
		}
		return data
	},

	async getCustomerBookings(
		customerId: string,
	): Promise<(Booking & { painter: Painter })[]> {
		const response = await fetch(
			`${API_BASE_URL}/bookings/customer?customerId=${customerId}`,
		)
		if (!response.ok) {
			throw new Error('Failed to fetch customer bookings')
		}
		return response.json()
	},

	async getPainterBookings(
		painterId: string,
	): Promise<(Booking & { customer: Customer })[]> {
		const response = await fetch(
			`${API_BASE_URL}/bookings/painter?painterId=${painterId}`,
		)
		if (!response.ok) {
			throw new Error('Failed to fetch painter bookings')
		}
		return response.json()
	},

	// Debug endpoint
	async getDebugInfo() {
		const response = await fetch(`${API_BASE_URL}/debug`)
		if (!response.ok) {
			throw new Error('Failed to fetch debug info')
		}
		return response.json()
	},
}
