import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	// Get the pathname of the request
	const path = request.nextUrl.pathname

	// Define public paths that don't require authentication
	const isPublicPath = path === '/login' || path === '/signup' || path === '/'

	// Get the token from cookies
	const token = request.cookies.get('auth_token')?.value

	// If the user is not authenticated and tries to access a protected route
	if (!isPublicPath && !token) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// Role-based access control
	if (token && !isPublicPath) {
		try {
			// Parse JWT token (format: header.payload.signature)
			const payload = token.split('.')[1]
			// Decode the base64 payload
			const decodedPayload = JSON.parse(
				Buffer.from(payload, 'base64').toString(),
			)
			const userRole = decodedPayload.role?.toLowerCase()

			// Check if painter is trying to access customer routes
			if (
				(userRole === 'painter' || userRole === 'PAINTER') &&
				path.startsWith('/customer')
			) {
				return NextResponse.redirect(new URL('/painter', request.url))
			}

			// Check if customer is trying to access painter routes
			if (
				(userRole === 'customer' || userRole === 'CUSTOMER') &&
				path.startsWith('/painter')
			) {
				return NextResponse.redirect(new URL('/customer', request.url))
			}
		} catch (error) {
			// If token parsing fails, redirect to login
			console.error('Error parsing token:', error)
			return NextResponse.redirect(new URL('/login', request.url))
		}
	}

	// Allow all other requests to proceed
	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/login', '/signup', '/painter/:path*', '/customer/:path*'],
}
