/**
 * Validates booking request data
 * @param {Object} requestBody - Request body
 * @returns {Object} - Validation result with error message if invalid
 */
function validateBookingRequest(requestBody) {
  const { startTime, endTime, customerId } = requestBody;
  
  if (!startTime || !endTime || !customerId) {
    return {
      isValid: false,
      error: 'Missing required fields: startTime, endTime, and customerId are required'
    };
  }
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format for startTime or endTime'
    };
  }
  
  if (start >= end) {
    return {
      isValid: false,
      error: 'startTime must be before endTime'
    };
  }
  
  return { isValid: true };
}

/**
 * Validates user data
 * @param {Object} userData - User data
 * @param {string} userType - User type (painter or customer)
 * @returns {Object} - Validation result with error message if invalid
 */
function validateUserData(userData, userType) {
  const { name, email } = userData;
  
  if (!name || !email) {
    return {
      isValid: false,
      error: 'Name and email are required'
    };
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }
  
  // Validate painter-specific fields
  if (userType === 'painter') {
    const { specialty, experience } = userData;
    
    if (!specialty) {
      return {
        isValid: false,
        error: 'Specialty is required for painters'
      };
    }
    
    if (experience === undefined || isNaN(experience)) {
      return {
        isValid: false,
        error: 'Experience must be a number'
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Validates availability data
 * @param {Object} availabilityData - Availability data
 * @returns {Object} - Validation result with error message if invalid
 */
function validateAvailability(availabilityData) {
  const { painterId, startTime, endTime } = availabilityData;
  
  if (!painterId || !startTime || !endTime) {
    return {
      isValid: false,
      error: 'Missing required fields: painterId, startTime, and endTime are required'
    };
  }
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format for startTime or endTime'
    };
  }
  
  if (start >= end) {
    return {
      isValid: false,
      error: 'startTime must be before endTime'
    };
  }
  
  return { isValid: true };
}

module.exports = {
  validateBookingRequest,
  validateUserData,
  validateAvailability
};