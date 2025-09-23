const { v4: uuidv4 } = require('uuid')
const { formatDate, formatTime } = require('../dateFormatter')

/**
 * Creates a new booking and updates availability
 * @param {Object} db - Database object
 * @param {Object} bookingData - Booking data
 * @returns {Object} - New booking object
 */
function createBooking(db, { startTime, endTime, painterId, customerId }) {
	// Create booking
	const newBooking = {
		id: uuidv4(),
		painterId,
		customerId,
		startTime,
		endTime,
		status: 'confirmed',
		createdAt: new Date().toISOString(),
	}

	db.bookings.push(newBooking)
	return newBooking
}

/**
 * Updates availability after a booking is created
 * @param {Object} db - Database object
 * @param {Object} availableSlot - Available slot
 * @param {string} startTime - Booking start time
 * @param {string} endTime - Booking end time
 */
function updateAvailabilityAfterBooking(db, availableSlot, startTime, endTime) {
	// Update availability (remove or split)
	const availIndex = db.availabilities.findIndex(
		(avail) => avail.id === availableSlot.id,
	)

	const avail = db.availabilities[availIndex]
	const bookingStart = new Date(startTime)
	const bookingEnd = new Date(endTime)
	const availStart = new Date(avail.startTime)
	const availEnd = new Date(avail.endTime)

	// Remove the original availability
	db.availabilities.splice(availIndex, 1)

	// Create availability for time before booking (if any)
	if (bookingStart > availStart) {
		db.availabilities.push({
			id: uuidv4(),
			painterId: avail.painterId,
			startTime: avail.startTime,
			endTime: startTime,
			createdAt: new Date().toISOString(),
		})
	}

	// Create availability for time after booking (if any)
	if (bookingEnd < availEnd) {
		db.availabilities.push({
			id: uuidv4(),
			painterId: avail.painterId,
			startTime: endTime,
			endTime: avail.endTime,
			createdAt: new Date().toISOString(),
		})
	}
}

/**
 * Finds available slots for a booking request
 * @param {Object} db - Database object
 * @param {string} startTime - Requested start time
 * @param {string} endTime - Requested end time
 * @param {string} painterId - Optional painter ID
 * @returns {Array} - Available slots
 */
function findAvailableSlots(db, startTime, endTime, painterId) {
	return db.availabilities.filter((avail) => {
		const availStart = new Date(avail.startTime)
		const availEnd = new Date(avail.endTime)
		const bookingStart = new Date(startTime)
		const bookingEnd = new Date(endTime)

		// If painterId is specified, match it exactly
		// Otherwise, collect all available painters
		return (
			(painterId ? avail.painterId === painterId : true) &&
			bookingStart >= availStart &&
			bookingEnd <= availEnd
		)
	})
}

/**
 * Finds the best painter based on ratings
 * @param {Object} db - Database object
 * @param {Array} availableSlots - Available slots
 * @returns {Object} - Best painter and slot
 */
function findBestPainter(db, availableSlots) {
	// Get all painters with their ratings
	const availablePainters = availableSlots.map((slot) => {
		const painter = db.painters.find((p) => p.id === slot.painterId)
		return {
			slot,
			painter,
			rating: painter ? painter.rating : 0,
		}
	})

	// Sort by rating (highest first)
	availablePainters.sort((a, b) => b.rating - a.rating)

	// Return the highest rated painter's slot
	return availablePainters[0]
}

/**
 * Finds the closest available slot
 * @param {Object} db - Database object
 * @param {string} startTime - Requested start time
 * @param {string} endTime - Requested end time
 * @param {string} painterId - Optional painter ID
 * @returns {Object} - Closest available slot or null
 */
function findClosestAvailableSlot(db, startTime, endTime, painterId) {
	const requestedStartTime = new Date(startTime)
	const duration = new Date(endTime).getTime() - requestedStartTime.getTime()

	// Search for available slots in the next 7 days
	for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
		for (let hourOffset = 0; hourOffset <= 12; hourOffset += 2) {
			const slotStart = new Date(requestedStartTime)
			slotStart.setDate(slotStart.getDate() + dayOffset)
			slotStart.setHours(slotStart.getHours() + hourOffset, 0, 0, 0)

			const slotEnd = new Date(slotStart.getTime() + duration)

			// Check if any availability matches this slot
			const closestSlot = db.availabilities.find((avail) => {
				const availStart = new Date(avail.startTime)
				const availEnd = new Date(avail.endTime)
				return (
					(painterId ? avail.painterId === painterId : true) &&
					slotStart >= availStart &&
					slotEnd <= availEnd
				)
			})

			if (closestSlot) {
				const painter = db.painters.find((p) => p.id === closestSlot.painterId)

				return {
					slot: closestSlot,
					response: {
						startTime: slotStart.toISOString(),
						endTime: slotEnd.toISOString(),
						message: `Closest available slot: ${formatDate(
							slotStart,
						)} at ${formatTime(slotStart)}`,
						painter,
					},
				}
			}
		}
	}

	return null
}

/**
 * Finds a suitable availability match for a booking request
 * @param {Object} db - Database object
 * @param {string} startTime - Requested start time
 * @param {string} endTime - Requested end time
 * @param {string} painterId - Optional painter ID
 * @returns {Object} - Matching availability or null
 */
function findExactAvailabilityMatch(db, startTime, endTime, painterId) {
	return db.availabilities.find((avail) => {
		const availStart = new Date(avail.startTime)
		const availEnd = new Date(avail.endTime)
		const bookingStart = new Date(startTime)
		const bookingEnd = new Date(endTime)

		// Allow partial slot bookings - just ensure the booking fits within the availability
		// The booking can start at or after the availability start
		const startTimeMatch = bookingStart >= availStart

		// The booking must end before or at the availability end
		const endTimeMatch = bookingEnd <= availEnd

		// Match painter if specified
		const painterMatch = !painterId || avail.painterId === painterId

		return startTimeMatch && endTimeMatch && painterMatch
	})
}

module.exports = {
	createBooking,
	updateAvailabilityAfterBooking,
	findAvailableSlots,
	findBestPainter,
	findClosestAvailableSlot,
	findExactAvailabilityMatch,
}
