/**
 * Date and time formatting utility for consistent formatting across the application
 */

// Format a date to a readable string (e.g., "Jan 15, 2023")
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format a time to a readable string (e.g., "2:30 PM")
function formatTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format a date and time together (e.g., "Jan 15, 2023, 2:30 PM")
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format a date range (e.g., "Jan 15, 2:30 PM - 4:30 PM" or "Jan 15, 2:30 PM - Jan 16, 4:30 PM")
function formatDateTimeRange(startDate, endDate) {
  if (!(startDate instanceof Date)) {
    startDate = new Date(startDate);
  }
  if (!(endDate instanceof Date)) {
    endDate = new Date(endDate);
  }
  
  // If same day, only show the date once
  if (startDate.toDateString() === endDate.toDateString()) {
    return `${formatDate(startDate)}, ${formatTime(startDate)} - ${formatTime(endDate)}`;
  } else {
    return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
  }
}

// Format for ISO string for HTML datetime-local input
function formatDateTimeForInput(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().slice(0, 16);
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateTimeRange,
  formatDateTimeForInput
};