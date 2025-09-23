const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { formatDate, formatTime } = require('../dateFormatter')
const {
	createBooking,
	updateAvailabilityAfterBooking,
	findAvailableSlots,
	findBestPainter,
	findClosestAvailableSlot,
	findExactAvailabilityMatch,
} = require('../utils/bookingUtils')
const { validateBookingRequest } = require('../utils/validationUtils')

// Create a booking request
router.post('/request', (req, res) => {
	const db = req.app.locals.db
	let { startTime, endTime, customerId } = req.body
	let { painterId } = req.body

	// Validate request
	const validation = validateBookingRequest(req.body)
	if (!validation.isValid) {
		return res.status(400).json({ error: validation.error })
	}

	// Find available slots
	const availableSlots = findAvailableSlots(db, startTime, endTime, painterId)
	console.log(availableSlots)
	// If no painter specified or no slots available for specified painter
	if (!painterId || availableSlots.length === 0) {
		// Find all available slots regardless of painter
		const allAvailableSlots = findAvailableSlots(db, startTime, endTime)

		if (allAvailableSlots.length > 0) {
			// Find the best painter based on ratings
			const bestPainter = findBestPainter(db, allAvailableSlots)

			if (bestPainter) {
				const availableSlot = bestPainter.slot
				painterId = availableSlot.painterId
			} else {
				return res.status(400).json({ message: 'No available painters found' })
			}
		} else {
			// Try to find the closest available slot
			const closestAvailability = findClosestAvailableSlot(
				db,
				startTime,
				endTime,
				painterId,
			)

			if (closestAvailability) {
				return res.status(400).json({
					message: 'No availability for the requested time',
					closestAvailableSlot: closestAvailability.response,
				})
			} else {
				return res.status(400).json({
					message: 'No availability found in the next 7 days',
				})
			}
		}
	}

	// Check for exact match
	const exactMatch = findExactAvailabilityMatch(
		db,
		startTime,
		endTime,
		painterId,
	)
	if (!exactMatch) {
		return res
			.status(400)
			.json({ message: 'No exact match found for the requested time' })
	}

	// Create booking
	const newBooking = createBooking(db, {
		startTime,
		endTime,
		painterId,
		customerId,
	})

	// Update availability
	updateAvailabilityAfterBooking(db, exactMatch, startTime, endTime)

	res.status(201).json(newBooking)
})

// Get customer bookings
router.get('/customer', (req, res) => {
	const { customerId } = req.query
	const db = req.app.locals.db

	if (!customerId) {
		return res.status(400).json({ message: 'Customer ID is required' })
	}

	const bookings = db.bookings
		.filter((booking) => booking.customerId === customerId)
		.map((booking) => {
			const painter = db.painters.find((p) => p.id === booking.painterId) || {
				id: booking.painterId,
				name: 'Unknown Painter',
				email: '',
				type: 'painter',
				rating: 0,
				experience: 0,
			}

			return { ...booking, painter }
		})

	res.json(bookings)
})

// Get painter bookings
router.get('/painter', (req, res) => {
	const { painterId } = req.query
	const db = req.app.locals.db

	if (!painterId) {
		return res.status(400).json({ message: 'Painter ID is required' })
	}

	const bookings = db.bookings
		.filter((booking) => booking.painterId === painterId)
		.map((booking) => {
			const customer = db.customers.find(
				(c) => c.id === booking.customerId,
			) || {
				id: booking.customerId,
				name: 'Unknown Customer',
				email: '',
				type: 'customer',
				address: '',
			}

			return { ...booking, customer }
		})

	res.json(bookings)
})

module.exports = router
