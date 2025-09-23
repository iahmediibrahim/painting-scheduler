const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { validateAvailability } = require('../utils/validationUtils')

// Get painter availability
router.get('/', (req, res) => {
	const db = req.app.locals.db
	const { painterId } = req.query

	if (!painterId) {
		return res.json(db.availabilities)
	}

	const painterAvailability = db.availabilities.filter(
		(avail) => avail.painterId === painterId,
	)

	res.json(painterAvailability)
})

// Get current painter's availability
router.get('/me', (req, res) => {
	const db = req.app.locals.db
	const { painterId } = req.query

	if (!painterId) {
		return res.status(400).json({ error: 'painterId is required' })
	}

	const painterAvailability = db.availabilities.filter(
		(avail) => avail.painterId === painterId,
	)

	res.json(painterAvailability)
})

// Add new availability
router.post('/', (req, res) => {
	const db = req.app.locals.db
	const validation = validateAvailability(req.body)

	if (!validation.isValid) {
		return res.status(400).json({ error: validation.error })
	}

	const newAvailability = {
		id: uuidv4(),
		...req.body,
		createdAt: new Date().toISOString(),
	}

	db.availabilities.push(newAvailability)
	res.status(201).json(newAvailability)
})

// Delete availability
router.delete('/:id', (req, res) => {
	const db = req.app.locals.db
	const { id } = req.params

	const availIndex = db.availabilities.findIndex((avail) => avail.id === id)

	if (availIndex === -1) {
		return res.status(404).json({ error: 'Availability not found' })
	}

	db.availabilities.splice(availIndex, 1)
	res.status(200).json({ message: 'Availability deleted successfully' })
})

module.exports = router
