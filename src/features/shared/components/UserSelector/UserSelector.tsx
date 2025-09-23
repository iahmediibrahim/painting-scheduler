'use client'
import { Card, CardBody } from '@/features/shared'
import { useUser } from '@/hooks/useUser'
import { Painter, User } from '@/types'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserSelectorProps {
	onUserChange: (user: User) => void
	currentUser?: User | null
}

export function UserSelector({ onUserChange, currentUser }: UserSelectorProps) {
	const pathname = usePathname()
	const { painters, customers } = useUser()
	const userType = pathname.includes('painter') ? 'painter' : 'customer'

	const [selectedUserId, setSelectedUserId] = useState<string>('')
	const [isLoading, setIsLoading] = useState(true)

	// Get the appropriate user list based on the user type
	const users = userType === 'painter' ? painters : customers

	// Initialize user selection
	useEffect(() => {
		if (users.length > 0) {
			setIsLoading(false)

			// Prefer current user if it matches the type, otherwise use first user
			const matchingUser =
				currentUser && currentUser.type === userType
					? users.find((u) => u.id === currentUser.id) || users[0]
					: users[0]

			setSelectedUserId(matchingUser.id)
			onUserChange(matchingUser)
		}
	}, [users, currentUser, userType, onUserChange])

	const handleUserChange = (userId: string) => {
		setSelectedUserId(userId)
		const user = users.find((u) => u.id === userId)
		if (user) {
			onUserChange(user)
		}
	}

	if (isLoading && users.length === 0) {
		return (
			<Card className="mb-6">
				<CardBody>
					<div className="animate-pulse">
						<div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
					</div>
				</CardBody>
			</Card>
		)
	}

	return (
		<Card className="mb-6 transform transition-all hover:shadow-lg">
			<CardBody>
				<div className="flex items-center mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-indigo-600 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
					</svg>
					<h2 className="text-xl font-semibold text-gray-800">
						Select {userType === 'painter' ? 'Painter' : 'Customer'}
					</h2>
				</div>

				{users.length > 0 && (
					<div>
						<select
							value={selectedUserId}
							onChange={(e) => handleUserChange(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
						>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name}{' '}
									{userType === 'painter'
										? `(⭐ ${(user as Painter).rating || 'N/A'})`
										: ''}
								</option>
							))}
						</select>
					</div>
				)}

				{selectedUserId && (
					<div className="mt-4 p-3 bg-indigo-50 rounded-md border-l-4 border-indigo-500 transition-all">
						<div className="flex items-center">
							<span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
								{userType === 'painter' ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-indigo-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-indigo-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</span>
							<p className="text-sm text-indigo-700">
								Currently acting as:{' '}
								<strong>
									{users.find((u) => u.id === selectedUserId)?.name}
								</strong>
								{userType === 'painter' && (
									<span>
										{' '}
										- Rating:{' '}
										{(users.find((u) => u.id === selectedUserId) as Painter)
											?.rating || 'N/A'}
									</span>
								)}
							</p>
						</div>
					</div>
				)}

				{users.length === 0 && (
					<div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
						<div className="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-amber-600 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-amber-700">
								No users found. Please check the API connection.
							</p>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	)
}
