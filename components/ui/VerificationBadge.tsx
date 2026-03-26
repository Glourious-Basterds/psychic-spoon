import React from 'react';
import { Check } from 'lucide-react';

interface VerificationBadgeProps {
    rating: number;
    size?: number;
    className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
    rating, 
    size = 14, 
    className = "" 
}) => {
    if (rating < 4.0) return null;

    return (
        <span 
            className={`inline-flex items-center justify-center bg-blue-500 text-white rounded-full shadow-sm ${className}`} 
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
            title="Verified Specialist (4.0+ Star Rating)"
        >
            <Check size={size * 0.7} strokeWidth={4} />
        </span>
    );
};
