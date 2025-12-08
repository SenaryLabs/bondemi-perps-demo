'use client';

import { X, Check, Laptop, Moon, Terminal, Feather, Zap, Sunrise, CloudSnow, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Theme, useTheme } from '@/hooks/use-theme';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { theme, changeTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const themes: { id: Theme; label: string; icon: any; colors: string[] }[] = [
        { 
            id: 'system', 
            label: 'System', 
            icon: Laptop, 
            colors: ['#0B1221', '#F8FAFC'] 
        },
        { 
            id: 'capital', 
            label: 'Capital', 
            icon: Activity, 
            colors: ['#101010', '#d4af37'] 
        },
        { 
            id: 'midnight', 
            label: 'Midnight', 
            icon: Moon, 
            colors: ['#0B1221', '#6366f1'] 
        },
        { 
            id: 'obsidian', 
            label: 'Obsidian', 
            icon: Laptop, 
            colors: ['#000000', '#FFFFFF'] 
        },
        { 
            id: 'terminal', 
            label: 'Terminal', 
            icon: Terminal, 
            colors: ['#1e1e1e', '#f97316'] 
        },
        { 
            id: 'mindful', 
            label: 'Mindful', 
            icon: Feather, 
            colors: ['#112244', '#DFC6AA'] 
        },
        { 
            id: 'lime', 
            label: 'Neon Lime', 
            icon: Zap, 
            colors: ['#0F1519', '#B8E100'] 
        },
        { 
            id: 'sunset', 
            label: 'Sunset', 
            icon: Sunrise, 
            colors: ['#331233', '#FBCA69'] 
        },
        { 
            id: 'arctic', 
            label: 'Arctic', 
            icon: CloudSnow, 
            colors: ['#F7F5EC', '#1B8188'] 
        },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[400px] max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur">
                    <h2 className="text-lg font-bold tracking-tight">Global Settings</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Theme Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interface Theme</label>
                        <div className="grid grid-cols-2 gap-3 justify-center mx-auto">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => changeTheme(t.id)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium",
                                        theme === t.id 
                                            ? "bg-primary/10 border-primary text-primary shadow-sm" 
                                            : "bg-card hover:bg-muted/50 border-border text-foreground/80"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-md bg-background border border-border/50">
                                            <t.icon size={16} />
                                        </div>
                                        <span>{t.label}</span>
                                    </div>
                                    
                                    {/* Color Preview */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            {t.colors.map(c => (
                                                <div key={c} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                                            ))}
                                        </div> 
                                        {theme === t.id && <Check size={16} className="text-primary" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
