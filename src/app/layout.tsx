import { Navigation } from '@/features/shared/components'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
	title: 'Painting Scheduler',
	description: 'Schedule your painting services with professional painters',
	icons: {
		icon: '🎨',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className="bg-gray-50 min-h-screen">
				<Providers>
					<Navigation />
					<main>
						{children}
					</main>
					<Toaster position="top-center" reverseOrder={false} />
				</Providers>
			</body>
		</html>
	)
}
