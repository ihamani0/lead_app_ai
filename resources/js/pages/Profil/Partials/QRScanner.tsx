// resources/js/Pages/Instances/Partials/QRScanner.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { TFunction } from 'i18next';
import { QrCode, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
    qrCode: string | null;
    isLoading: boolean;
    onGenerate: () => void;
    t: TFunction;
}

export function QRScanner({ qrCode, isLoading, onGenerate, t }: Props) {
    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleRegenerate = () => {
        setIsRegenerating(true);
        onGenerate();
        setTimeout(() => setIsRegenerating(false), 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-linear-to-br from-amber-50/80 to-white p-6 shadow-lg md:p-8 dark:border-amber-500/20 dark:from-amber-950/30 dark:to-background"
        >
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
                {/* Left: Instructions */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 shadow-inner ring-2 ring-amber-200/50 dark:bg-amber-900/30 dark:ring-amber-700/30"
                    >
                        <QrCode className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                    </motion.div>

                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-amber-950 dark:text-amber-50">
                            
                            {t("profil.link_whatsApp")}

                        </h2>
                        <p className="mt-2 text-amber-800/80 dark:text-amber-400/80">
                              
                            {t("profil.scan_qr_description")}
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        <Step number={1} text={t("profil.open_whatsapp")} />
                        <Step
                            number={2}
                            text={t("profil.go_to_settings")}
                        />
                        <Step number={3} text={t("profil.tap_to_link")} />
                    </div>
                </div>

                {/* Right: QR Display */}
                <div className="flex flex-col items-center gap-4">
                    <AnimatePresence mode="wait">
                        {!qrCode ? (
                            <motion.div
                                key="button"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={onGenerate}
                                    disabled={isLoading}
                                    className="h-16 rounded-xl bg-linear-to-r from-amber-600 to-amber-500 px-8 text-lg font-bold text-white shadow-lg shadow-amber-200/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-300/50 disabled:opacity-70 dark:shadow-amber-900/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    ) : (
                                        <Smartphone className="mr-3 h-6 w-6" />
                                    )}
                                    {isLoading
                                        ? t("profil.connecting")
                                        : t("profil.generate_qr_code")}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr"
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    rotate: -10,
                                }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                className="group relative"
                            >
                                {/* QR Container */}
                                <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-700/50">
                                    <div className="relative">
                                        <QRCodeSVG
                                            value={qrCode}
                                            size={200}
                                            level="H"
                                            includeMargin
                                            className="rounded-lg"
                                        />

                                        {/* Scanning animation overlay */}
                                        <motion.div
                                            className="absolute inset-0 bg-linear-to-b from-transparent via-amber-500/20 to-transparent"
                                            animate={{
                                                y: [-100, 200],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'linear',
                                            }}
                                        />
                                    </div>

                                    {/* Corner decorations */}
                                    <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-amber-500/50" />
                                    <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-amber-500/50" />
                                    <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-amber-500/50" />
                                    <div className="absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-amber-500/50" />
                                </div>

                                {/* Status & Actions */}
                                <div className="mt-5 flex flex-col items-center gap-3">
                                    <Badge
                                        variant="outline"
                                        className="animate-pulse border-amber-500/50 bg-amber-50 px-4 py-1.5 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                    >
                                        <span className="mr-2 flex h-2 w-2 rounded-full bg-amber-500" />
                                        
                                        {t("profil.waiting_scan")}
                                    </Badge>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRegenerate}
                                        disabled={isRegenerating}
                                        className="group/btn text-xs font-medium text-amber-800 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                    >
                                        <RefreshCw
                                            className={`mr-2 h-3.5 w-3.5 transition-transform ${isRegenerating ? 'animate-spin' : 'group-hover/btn:rotate-180'}`}
                                        />
                                        {t("profil.refresh_qr")}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-orange-400/5 blur-2xl" />
        </motion.div>
    );
}

// Sub-component for steps
function Step({ number, text }: { number: number; text: string }) {
    return (
        <div className="flex items-center justify-center gap-3 text-sm text-amber-800 lg:justify-start dark:text-amber-400/90">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 shadow-sm dark:bg-amber-800 dark:text-amber-200">
                {number}
            </span>
            <span className="font-medium">{text}</span>
        </div>
    );
}
