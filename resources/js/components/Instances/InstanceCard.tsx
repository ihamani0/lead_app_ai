import { Link, router } from '@inertiajs/react';
import { Phone, PowerOff, Settings2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils'; // Make sure you have the shadcn utils
import { destroy } from '@/routes/instances';
import { show } from '@/routes/profile';
import type { EvolutionInstance } from '@/types';

interface InstanceCardProps {
    instance: EvolutionInstance;
}

export default function InstanceCard({ instance }: InstanceCardProps) {
    const { t } = useTranslation();

    const displayName =
        instance.instance_name.split('-').slice(1, -1).join(' ') ||
        instance.instance_name;

    const isConnected = instance.status === 'connected';
    const isConnecting = instance.status === 'connecting';
    const isDisconnected = instance.status === 'disconnected';

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling

        if (confirm('Are you sure you want to delete this instance?')) {
            router.delete(destroy({ id: instance.id }).url, {
                preserveScroll: true,
            });
        }
    };

const statusStyles = {
  connected: {
    border: "border-emerald-200/50",
    bar: "bg-emerald-500",
    indicator: "bg-emerald-500 shadow-sm shadow-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",

    style:
      ` border-emerald-200/50 from-emerald-50/80 to-white dark:border-emerald-500/20 dark:from-emerald-950/30 dark:to-background`,
  },

  connecting: {
    border: "border-amber-500/30",
    bar: "bg-amber-500",
    indicator: "bg-amber-500 animate-pulse shadow-sm shadow-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",

    style:
      `border-amber-200/50 from-amber-50/80 to-white dark:border-amber-500/20 dark:from-amber-950/30 dark:to-background`,
  },

  disconnected: {
    border: "border-destructive/40",
    bar: "bg-destructive",
    indicator: "bg-destructive shadow-sm shadow-destructive/40",
    text: "text-destructive",

    style:
      `border-destructive/30 from-destructive/5 to-white dark:border-destructive/20 dark:from-destructive/10 dark:to-background`,
  },

}


    const currentStyle = isConnected
        ? statusStyles.connected
        : isConnecting
          ? statusStyles.connecting
          : statusStyles.disconnected;

    return (
        <Link href={show({ id: instance.id })}>
            <Card
                className={cn(
                "group relative overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg   rounded-2xl   bg-linear-to-br p-6 shadow-lg  ",
                currentStyle.style
                )}
            >
                {/* <div className={cn("h-1.5 w-full", currentStyle.bar)} /> */}
                {/* Background gradient overlay */}
                 

                {/* Action Buttons */}
                    {/* delete button */}
                    <div className="absolute right-3 top-3 z-20 opacity-0 transition group-hover:opacity-100">
                        <button
                            onClick={handleDelete}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:scale-110 transition"
                            title={t("profil.deleteInstance")}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                 

                <CardHeader className="flex flex-row items-start justify-between px-6 pt-6">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-xl font-bold text-foreground">
                        {displayName}
                        </CardTitle>

                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {t("profil.node")}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div
                        className={cn("h-2.5 w-2.5 rounded-full", currentStyle.indicator)}
                        />

                        <span
                        className={cn(
                            "text-[10px] font-bold uppercase",
                            currentStyle.text
                        )}
                        >
                        {t(`profil.status.${instance.status}`)}
                        </span>
                    </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                    {/* phone */}
                    <div className="mt-4 flex items-center gap-4 rounded-xl bg-muted p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                        {isDisconnected ? (
                            <PowerOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <Phone className="h-5 w-5 text-primary" />
                        )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                {t("profil.linkedNumber")}
                            </span>

                            <span className={cn( 'text-lg font-black tracking-tight', isDisconnected ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200' )}>
                                {instance.phone_number ? `+${instance.phone_number}` : "--- --- ---"}
                            </span>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground">
                            {t("profil.deployment")}
                        </span>

                        <span className="text-xs font-semibold text-muted-foreground">
                            {new Date(instance.created_at).toLocaleDateString()}
                        </span>
                        </div>

                        {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition group-hover:opacity-100">
                        <Settings2 className="h-4 w-4" />
                        </div> */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-indigo-500/10 dark:text-indigo-400"> <Settings2 className="h-4 w-4" /> </div>
                    </div>
                    </CardContent>
                </Card>
        </Link>
    );
}
