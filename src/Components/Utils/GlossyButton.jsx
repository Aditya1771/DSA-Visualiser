import React from "react";

/**
 * Reusable Glossy Button with Shimmer and Glow effects.
 */
const GlossyButton = ({ 
    onClick, 
    disabled, 
    gradientClasses, 
    children, 
    className = '', 
    pulse = false, 
    isDark = true 
}) => {
    return (
        <div className={`relative group ${className}`}>
            {/* Outer Glow/Blur Effect */}
            <div
                className={`absolute -inset-0.5 ${gradientClasses} rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 ${
                    disabled ? 'hidden' : ''
                } ${pulse ? 'animate-pulse' : ''}`}
            />
            
            {/* Main Button */}
            <button
                onClick={onClick}
                disabled={disabled}
                className={`relative w-full h-full p-px text-sm font-semibold rounded-2xl overflow-hidden transition-all duration-300
                    ${!disabled ? gradientClasses : 'bg-gray-500/50'}
                    ${isDark ? 'text-gray-200' : 'text-white'}
                    disabled:cursor-not-allowed`}
            >
                {/* Internal Glassmorphism Layer */}
                <div className={`relative w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 backdrop-blur-sm rounded-[15px] transition-colors duration-300 
                    ${isDark ? 'bg-gray-900/80 group-hover:bg-gray-900/70' : 'bg-white/10 group-hover:bg-white/20'}`}>
                    
                    {/* Shimmer Effect Span */}
                    <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
                    
                    {/* Content (Text/Icons) */}
                    <span className="relative z-10 flex items-center justify-center gap-2 shadow-sm">
                        {children}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default GlossyButton;