export function HeroInterfaceMockup() {
    return (
        <div className="relative w-full max-w-[800px] h-[400px] perspective-[2000px] group mx-auto mt-16 hidden lg:block animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
            {/* The 3D Card */}
            <div className="absolute inset-0 bg-card border border-border/50 rounded-xl shadow-2xl transform rotate-x-[20deg] rotate-y-[-10deg] rotate-z-[5deg] scale-90 group-hover:rotate-x-[10deg] group-hover:rotate-y-[-5deg] group-hover:scale-95 transition-all duration-700 ease-out border-t-primary/20 bg-gradient-to-br from-muted/50 via-card to-background overflow-hidden">
                
                {/* Mock Header */}
                <div className="h-10 border-b border-border/50 flex items-center px-4 justify-between bg-muted/20">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="w-32 h-3 bg-muted/30 rounded-full" />
                </div>

                {/* Mock Content Layout */}
                <div className="flex h-full p-4 gap-4">
                    {/* Left: Chart Area */}
                    <div className="flex-1 space-y-4">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-primary/20" />
                                <div className="space-y-1">
                                    <div className="w-24 h-4 bg-muted/40 rounded" />
                                    <div className="w-16 h-3 bg-muted/20 rounded" />
                                </div>
                            </div>
                            <div className="w-24 h-6 bg-emerald-500/10 rounded border border-emerald-500/20" />
                         </div>
                         
                         {/* Chart Placeholder with Gradient */}
                         <div className="h-[200px] w-full rounded-lg bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden border border-primary/10">
                            <svg className="absolute inset-0 w-full h-full text-primary/30" preserveAspectRatio="none">
                                <path d="M0,150 C100,100 200,180 300,80 C400,20 500,100 600,50 L600,200 L0,200 Z" fill="currentColor" />
                            </svg>
                         </div>
                    </div>

                    {/* Right: Order Form */}
                    <div className="w-[220px] bg-muted/10 rounded-lg border border-border/30 p-4 space-y-4">
                        <div className="flex gap-2">
                             <div className="h-8 flex-1 bg-emerald-500/20 rounded border border-emerald-500/30" />
                             <div className="h-8 flex-1 bg-muted/30 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-full bg-muted/20 rounded" />
                            <div className="h-8 w-full bg-muted/20 rounded" />
                            <div className="h-2 w-full bg-muted/10 rounded mt-4" />
                        </div>
                        <div className="pt-8">
                             <div className="h-10 w-full bg-primary rounded shadow-lg shadow-primary/20" />
                        </div>
                    </div>
                </div>
                
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>
        </div>
    );
}
