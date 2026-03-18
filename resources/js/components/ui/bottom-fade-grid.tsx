import React from 'react';

export default function BottomFadeGrid({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full bg-background">
        {/* Bottom Fade Grid Background */}
        <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
            backgroundImage: `
                linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
            maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
            }}
        />

        {/* Your Content */}
        <div className="relative z-10">{children}</div>
        </div>
    );
}
