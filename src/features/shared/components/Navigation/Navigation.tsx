'use client'

import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { currentUser, logout, isLoading } = useUser()
	const router = useRouter()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleLogout = async () => {
		await logout()
		router.push('/')
	}

	// Determine user role
	const userRole = currentUser?.role?.toLowerCase() || null

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-8xl mx-auto px-6 py-4">
				<div className="flex justify-between items-center">
					<Link
						href="/"
						className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition duration-200"
					>
						🎨 Painting Scheduler
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex space-x-4">
						{isLoading ? (
							<div className="flex items-center">
								<div className="animate-pulse bg-gray-200 h-5 w-16 rounded"></div>
							</div>
						) : !currentUser ? (
							<>
								<Link
									href="/login"
									className="text-gray-700 hover:text-blue-600 transition duration-200"
								>
									Login
								</Link>
								<Link
									href="/signup"
									className="text-gray-700 hover:text-blue-600 transition duration-200"
								>
									Sign Up
								</Link>
							</>
						) : (
							<>
								{userRole === 'painter' && (
									<Link
										href="/painter"
										className="text-gray-700 hover:text-blue-600 transition duration-200"
									>
										Painter Dashboard
									</Link>
								)}

								{userRole === 'customer' && (
									<Link
										href="/customer"
										className="text-gray-700 hover:text-blue-600 transition duration-200"
									>
										Customer Dashboard
									</Link>
								)}

								<button
									onClick={handleLogout}
									className="text-gray-700 hover:text-blue-600 transition duration-200"
								>
									Logout
								</button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="text-gray-700 hover:text-blue-600 focus:outline-none"
						>
							{isMenuOpen ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden mt-4 pb-2">
						<div className="flex flex-col space-y-3">
							{isLoading ? (
								<div className="py-2">
									<div className="animate-pulse bg-gray-200 h-5 w-16 rounded"></div>
								</div>
							) : !currentUser ? (
								<>
									<Link
										href="/login"
										className="text-gray-700 hover:text-blue-600 transition duration-200 py-2"
										onClick={() => setIsMenuOpen(false)}
									>
										Login
									</Link>
									<Link
										href="/signup"
										className="text-gray-700 hover:text-blue-600 transition duration-200 py-2"
										onClick={() => setIsMenuOpen(false)}
									>
										Sign Up
									</Link>
								</>
							) : (
								<>

							{userRole === 'painter' && (
								<Link
									href="/painter"
									className="text-gray-700 hover:text-blue-600 transition duration-200 py-2"
									onClick={() => setIsMenuOpen(false)}
								>
									Painter Dashboard
								</Link>
							)}

							{userRole === 'customer' && (
								<Link
									href="/customer"
									className="text-gray-700 hover:text-blue-600 transition duration-200 py-2"
									onClick={() => setIsMenuOpen(false)}
								>
									Customer Dashboard
								</Link>
							)}

							<button
								onClick={() => {
									handleLogout()
									setIsMenuOpen(false)
								}}
								className="text-gray-700 hover:text-blue-600 transition duration-200 py-2 text-left"
							>
								Logout
							</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}
