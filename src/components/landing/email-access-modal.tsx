'use client';

import { useState } from 'react';
import { X, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmailAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EmailAccessModal({ isOpen, onClose }: EmailAccessModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validation: Business Email Only
        const tempEmail = email.toLowerCase().trim();
        const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com'];
        const domain = tempEmail.split('@')[1];

        if (blockedDomains.includes(domain)) {
            setError('Please use a business email address (e.g. name@company.com). Free providers are not accepted.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/access', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                // Success - Redirect immediately
                router.push('/trade');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Mail size={24} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Early Access</h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your business email to access the Institutional Testnet.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-muted/20 border border-border/50 focus:border-primary/50 focus:bg-muted/30 outline-none transition-all placeholder:text-muted-foreground/30 font-medium"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-500 font-medium text-center">{error}</p>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Enter Exchange <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <p className="text-[10px] text-center text-muted-foreground/50">
                        By entering, you agree to our Testnet Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
}
