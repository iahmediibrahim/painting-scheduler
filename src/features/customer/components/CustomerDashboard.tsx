'use client'

import { Badge, Card, CardBody } from '@/features/shared'
import { Customer } from '@/types'

interface CustomerDashboardProps {
	customer: Customer
}

export default function CustomerDashboard({
	customer,
}: CustomerDashboardProps) {
	return (
		<Card className="mb-6 transform transition-all hover:translate-y-[-2px]">
			<CardBody>
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-900">
						Customer Dashboard
					</h1>
					<Badge variant="info">Active</Badge>
				</div>

				<div className="flex flex-col md:flex-row md:items-center md:justify-between">
					<div className="space-y-2">
						<div className="flex items-center">
							<span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
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
							</span>
							<span className="text-gray-700 font-medium">{customer.name}</span>
						</div>
						<div className="flex items-center">
							<span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-blue-600"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
							</span>
							<span className="text-gray-700">{customer.email}</span>
						</div>
					</div>

					<div className="mt-4 md:mt-0 space-y-2">
						<div className="flex items-center">
							<span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-green-600"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clipRule="evenodd"
									/>
								</svg>
							</span>
							<span className="text-gray-700">{customer.address}</span>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
