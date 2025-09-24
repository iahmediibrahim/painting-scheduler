export interface User {
	id: string
	name: string
	email: string
	role: 'painter' | 'customer'
}

export interface Painter extends User {
	type: 'painter'
	specialty?: string
	rating?: number
	experience?: number // years of experience
}

export interface Customer extends User {
	type: 'customer'
	address?: string
}

export interface Availability {
	id: string
	painterId: string
	painter?: Painter
	startTime: string
	endTime: string
	createdAt: string
}

export interface Booking {
	id: string
	painterId: string
	customerId: string
	painter?: Painter
	customer?: Customer
	startTime: string
	endTime: string
	status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
	createdAt: string
	address?: string
	description?: string
}

export interface BookingRequest {
	startTime: string
	endTime: string
	customerId: string
	preferredPainterId?: string
}

export interface AvailabilityRequest {
	startTime: string
	endTime: string
	painterId: string
}

export interface Recommendation {
	startTime: string
	endTime: string
	message: string
	painter?: Painter
}

export interface BookingResult {
	bookingId?: string
	painter?: Painter
	startTime?: string
	endTime?: string
	status?: string
	error?: string
	recommendation?: Recommendation
}

export interface TimeSlot {
	start: Date
	end: Date
	painter: Painter
}

export interface PainterPriorityCriteria {
	availabilityFit: number // 0-1, how well the slot fits
	rating: number // painter rating
	experience: number // years of experience
	currentWorkload: number // number of upcoming bookings
	distance?: number // distance to customer (if we had location data)
	specialtyMatch?: number // if we had job types
}
