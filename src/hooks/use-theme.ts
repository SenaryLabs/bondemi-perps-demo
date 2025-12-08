'use client';

import { useEffect, useState } from 'react';

export type Theme = 'midnight' | 'obsidian' | 'terminal' | 'mindful' | 'lime' | 'sunset' | 'arctic' | 'system' | 'capital';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('midnight');

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bondemi-theme') as Theme;
        if (saved) {
            applyTheme(saved);
        } else {
            // Default to system if no preference saved, or fallback to midnight
            applyTheme('system');
        }
    }, []);

    // Listen for system preference changes if theme is system
    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const applyTheme = (t: Theme) => {
        setTheme(t);
        let themeToApply = t;

        if (t === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'arctic';
            // Assuming 'midnight' is the default dark and 'arctic' is the default light for system
            // Ideally we'd map system dark/light to specific themes.
            // Let's use 'midnight' (Dark) and 'arctic' (Light) as system equivalents for now.
             document.documentElement.setAttribute('data-theme', systemTheme);
        } else {
             document.documentElement.setAttribute('data-theme', t);
        }
        
        if (t === 'system') {
             localStorage.removeItem('bondemi-theme');
        } else {
             localStorage.setItem('bondemi-theme', t);
        }
    };

    const changeTheme = (t: Theme) => {
        applyTheme(t);
    };

    return { theme, changeTheme };
}
