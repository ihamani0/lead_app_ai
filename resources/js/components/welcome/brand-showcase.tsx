import React from 'react';

function BrandShowcase({ brandName }: { brandName: string }) {
    return (
        <div className="flex items-center justify-center px-4">
            <h2 className="bg-linear-to-r from-primary to-secondary bg-clip-text font-mono text-[15vw] leading-none font-black tracking-tight tracking-widest text-transparent select-none md:text-[18vw] lg:text-[20vw]">
                {brandName}
            </h2>
        </div>
    );
}

export default BrandShowcase;
