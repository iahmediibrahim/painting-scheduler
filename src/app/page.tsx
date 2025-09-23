import { Card, CardBody, CardHeader } from '@/features/shared'
import { componentStyles } from '@/utils/theme'
import Link from 'next/link'

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="text-center mb-12 mt-20">
				<h1 className="text-4xl font-bold text-indigo-900 mb-4">
					Welcome to Painting Scheduler
				</h1>
				<p className="text-xl text-gray-600">
					Streamline your painting services with our automated scheduling system
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-20">
				<Card
					hover
					className="transform transition-all duration-300 flex flex-col"
				>
					<CardHeader>
						<h2 className="text-2xl font-semibold text-indigo-700">
							For Painters
						</h2>
					</CardHeader>
					<CardBody className="flex flex-col items-center justify-between flex-1">
						<div className="mb-6 text-center flex flex-col items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-16 w-16 text-indigo-500 mb-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
							</svg>
							<p className="text-gray-600">
								Set your availability and manage your bookings efficiently.
							</p>
						</div>
						<Link
							href="/painter"
							className={`${componentStyles.button.primary} w-full text-center`}
						>
							Painter Portal
						</Link>
					</CardBody>
				</Card>

				<Card
					hover
					className="transform transition-all duration-300 flex flex-col"
				>
					<CardHeader>
						<h2 className="text-2xl font-semibold text-indigo-700">
							For Customers
						</h2>
					</CardHeader>
					<CardBody className="flex flex-col items-center  justify-between flex-1">
						<div className="mb-6 text-center flex flex-col items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-16 w-16 text-indigo-500 mb-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-gray-600">
								Book painting services with available professionals.
							</p>
						</div>
						<Link
							href="/customer"
							className={`${componentStyles.button.secondary} w-full text-center`}
						>
							Customer Portal
						</Link>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}
