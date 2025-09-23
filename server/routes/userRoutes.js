const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { validateUserData } = require('../utils/validationUtils')

// Helper functions
const getUsersByType = (db, type) => {
	return type === 'painter' ? db.painters : db.customers
}

const getUserById = (db, id) => {
	return [...db.painters, ...db.customers].find((user) => user.id === id)
}

// Get users by type
router.get('/', (req, res) => {
	const { type } = req.query
	const db = req.app.locals.db

	if (!type || (type !== 'painter' && type !== 'customer')) {
		return res.status(400).json({ error: 'Invalid user type' })
	}

	const users = getUsersByType(db, type)
	res.json(users)
})

// Get user by ID
router.get('/:id', (req, res) => {
	const { id } = req.params
	const db = req.app.locals.db
	const user = getUserById(db, id)

	if (!user) {
		return res.status(404).json({ error: 'User not found' })
	}

	res.json(user)
})

// Get all painters
router.get('/painters', (req, res) => {
	const db = req.app.locals.db
	res.json(db.painters)
})

// Get all customers
router.get('/customers', (req, res) => {
	const db = req.app.locals.db
	res.json(db.customers)
})

// Create a new painter
router.post('/painters', (req, res) => {
	const db = req.app.locals.db
	const validation = validateUserData(req.body, 'painter')

	if (!validation.isValid) {
		return res.status(400).json({ error: validation.error })
	}

	const newPainter = {
		id: uuidv4(),
		...req.body,
		type: 'painter',
		rating: req.body.rating || 4.0,
		createdAt: new Date().toISOString(),
	}

	db.painters.push(newPainter)
	res.status(201).json(newPainter)
})

// Create a new customer
router.post('/customers', (req, res) => {
	const db = req.app.locals.db
	const validation = validateUserData(req.body, 'customer')

	if (!validation.isValid) {
		return res.status(400).json({ error: validation.error })
	}

	const newCustomer = {
		id: uuidv4(),
		...req.body,
		type: 'customer',
		createdAt: new Date().toISOString(),
	}

	db.customers.push(newCustomer)
	res.status(201).json(newCustomer)
})

module.exports = router
