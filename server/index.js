const express = require('express')
const cors = require('cors')
const path = require('path')
const { formatDate, formatTime, formatDateTime } = require('./dateFormatter')
const app = express()
const PORT = 3001

// Import routes
const bookingRoutes = require('./routes/bookingRoutes')
const userRoutes = require('./routes/userRoutes')
const availabilityRoutes = require('./routes/availabilityRoutes')

// Middleware
app.use(cors())
app.use(express.json())

// In-memory database
const db = {
	painters: [
		{
			id: '1',
			name: 'John Painter',
			email: 'john@example.com',
			type: 'painter',
			specialty: 'Interior',
			rating: 4.8,
			experience: 5,
		},
		{
			id: '2',
			name: 'Sarah Artist',
			email: 'sarah@example.com',
			type: 'painter',
			specialty: 'Exterior',
			rating: 4.9,
			experience: 8,
		},
		{
			id: '3',
			name: 'Mike Brush',
			email: 'mike@example.com',
			type: 'painter',
			specialty: 'Commercial',
			rating: 4.6,
			experience: 3,
		},
	],
	customers: [
		{
			id: '1',
			name: 'Customer One',
			email: 'customer1@example.com',
			type: 'customer',
			address: '123 Main St',
		},
		{
			id: '2',
			name: 'Customer Two',
			email: 'customer2@example.com',
			type: 'customer',
			address: '456 Oak Ave',
		},
		{
			id: '3',
			name: 'Customer Three',
			email: 'customer3@example.com',
			type: 'customer',
			address: '789 Pine Rd',
		},
	],
	availabilities: [
		{
			id: 'avail-1',
			painterId: '1',
			startTime: (() => {
				const tomorrow = new Date()
				tomorrow.setDate(tomorrow.getDate() + 1)
				tomorrow.setHours(9, 0, 0, 0)
				return tomorrow.toISOString()
			})(),
			endTime: (() => {
				const tomorrow = new Date()
				tomorrow.setDate(tomorrow.getDate() + 1)
				tomorrow.setHours(13, 0, 0, 0)
				return tomorrow.toISOString()
			})(),
			createdAt: new Date().toISOString(),
		},
		{
			id: 'avail-2',
			painterId: '2',
			startTime: (() => {
				const dayAfterTomorrow = new Date()
				dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
				dayAfterTomorrow.setHours(9, 0, 0, 0)
				return dayAfterTomorrow.toISOString()
			})(),
			endTime: (() => {
				const dayAfterTomorrow = new Date()
				dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
				dayAfterTomorrow.setHours(13, 0, 0, 0)
				return dayAfterTomorrow.toISOString()
			})(),
			createdAt: new Date().toISOString(),
		},
	],
	bookings: [],
}

// Make database available to routes
app.locals.db = db

// API Routes
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/availability', availabilityRoutes)

// Start server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
	console.log(
		`API documentation available at http://localhost:${PORT}/api-docs`,
	)
})
