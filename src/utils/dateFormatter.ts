/**
 * Date and time formatting utility functions
 * This file provides consistent date and time formatting across the application
 */

/**
 * Format a date to a human-readable date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

/**
 * Format a time to a human-readable time string (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

/**
 * Format a date and time to a human-readable string (e.g., "Jan 1, 2023, 2:30 PM")
 */
export const formatDateTime = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

/**
 * Format a date to ISO string format for input fields (YYYY-MM-DDThh:mm)
 */
export const formatDateTimeForInput = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.toISOString().slice(0, 16)
}

/**
 * Format a date range to a human-readable string (e.g., "Jan 1, 2:30 PM - 4:30 PM")
 */
export const formatDateTimeRange = (
	startDate: Date | string,
	endDate: Date | string,
): string => {
	const start = typeof startDate === 'string' ? new Date(startDate) : startDate
	const end = typeof endDate === 'string' ? new Date(endDate) : endDate

	// If same day, only show the date once
	if (start.toDateString() === end.toDateString()) {
		return `${formatDate(start)}, ${formatTime(start)} - ${formatTime(end)}`
	}

	// Different days, show both dates
	return `${formatDateTime(start)} - ${formatDateTime(end)}`
}
