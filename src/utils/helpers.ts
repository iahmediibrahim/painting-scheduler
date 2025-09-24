export const getStatusColor = (status: string) => {
	switch (status?.toUpperCase()) {
		case 'PENDING':
			return 'text-yellow-700 bg-yellow-50'
		case 'ACCEPTED':
			return 'text-blue-700 bg-blue-50'
		case 'COMPLETED':
			return 'text-green-700 bg-green-50'
		case 'CANCELLED':
			return 'text-red-700 bg-red-50'
		case 'REJECTED':
			return 'text-red-700 bg-red-50'
		default:
			return 'text-gray-700 bg-gray-50'
	}
}
