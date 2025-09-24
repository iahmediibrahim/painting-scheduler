'use client'

import { Badge, Card, CardBody } from '@/features/shared'
import { Painter } from '@/types'

interface PainterDashboardProps {
	painter: Painter
}

export default function PainterDashboard({ painter }: PainterDashboardProps) {
	return (
		<Card className="mb-6 transform transition-all hover:translate-y-[-2px]">
			<CardBody>
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-900">
						Painter Dashboard
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
							<span className="text-gray-700 font-medium">{painter.name}</span>
						</div>
						<div className="flex items-center">
							<span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-yellow-600"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</span>
							<span className="text-gray-700">
								Rating: <span className="font-medium">{painter.rating}/5</span>
							</span>
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
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clipRule="evenodd"
									/>
								</svg>
							</span>
							<span className="text-gray-700">
								Experience:{' '}
								<span className="font-medium">{painter.experience} years</span>
							</span>
						</div>
						<div className="flex items-center">
							<span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-blue-600"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
								</svg>
							</span>
							<span className="text-gray-700">
								Specialty: <span className="font-medium">{painter.role}</span>
							</span>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
