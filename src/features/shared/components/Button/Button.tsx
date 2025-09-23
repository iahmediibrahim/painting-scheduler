'use client'

import { componentStyles } from '@/utils/theme'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
	children: ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	variant?: ButtonVariant
	size?: ButtonSize
	disabled?: boolean
	fullWidth?: boolean
	className?: string
	icon?: ReactNode
}

export function Button({
	children,
	onClick,
	type = 'button',
	variant = 'primary',
	size = 'md',
	disabled = false,
	fullWidth = false,
	className = '',
	icon,
}: ButtonProps) {
	const baseStyle = componentStyles.button[variant]

	const sizeStyles = {
		sm: 'text-xs py-1 px-3',
		md: 'text-sm py-2 px-4',
		lg: 'text-base py-2.5 px-5',
	}

	const widthStyle = fullWidth ? 'w-full' : ''
	const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : ''

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyle} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} flex items-center justify-center gap-2 ${className}`}
		>
			{icon && <span className="inline-block">{icon}</span>}
			{children}
		</button>
	)
}
