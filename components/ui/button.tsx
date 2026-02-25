'use client';

import * as React from 'react';
import { cn } from '@/lib/utils'; // Assicurati di avere una utility cn o creala

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
            secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
            outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-900',
            ghost: 'bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-8 py-3.5 text-lg font-medium',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
