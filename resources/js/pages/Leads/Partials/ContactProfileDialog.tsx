import { Phone, Shield, Hash } from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import type { ContactProfile } from '@/lib/api/leadProfile';
import { fetchContactProfile } from '@/lib/api/leadProfile';
import type { Lead } from '@/types';

interface ContactProfileDialogProps {
    lead: Lead;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ContactProfileDialog: FC<ContactProfileDialogProps> = ({
    lead,
    open,
    onOpenChange,
}) => {
    const activeWorkspace = useActiveWorkspace();
    const [profile, setProfile] = useState<ContactProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setProfile(null);
            return;
        }

        setLoading(true);
        fetchContactProfile(activeWorkspace!.slug, lead.id)
            .then(setProfile)
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, [open, lead.id, activeWorkspace]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Profil du contact</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <ContactProfileSkeleton />
                ) : profile ? (
                    <ContactProfileContent profile={profile} />
                ) : (
                    <ContactProfileEmpty />
                )}
            </DialogContent>
        </Dialog>
    );
};

function ContactProfileContent({ profile }: { profile: ContactProfile }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                    {profile.picture ? (
                        <img
                            src={profile.picture}
                            alt={profile.name}
                            className="h-full w-full object-cover"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold text-white">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-foreground">
                        {profile.name}
                    </h3>
                    {profile.verified && (
                        <p className="text-sm text-muted-foreground">
                            ✓ {profile.verified}
                        </p>
                    )}
                    {profile.isBusiness && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Business
                        </span>
                    )}
                </div>
            </div>

            {profile.about && (
                <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground">À propos</p>
                    <p className="mt-1 text-sm text-foreground">{profile.about}</p>
                </div>
            )}

            <div className="space-y-2">
                <ProfileRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Téléphone"
                    value={`+${profile.phone}`}
                />
                {profile.lid && (
                    <ProfileRow
                        icon={<Hash className="h-4 w-4" />}
                        label="LID"
                        value={profile.lid}
                    />
                )}
                <ProfileRow
                    icon={<Shield className="h-4 w-4" />}
                    label="Source"
                    value="WhatsApp"
                />
            </div>
        </div>
    );
}

function ContactProfileSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
            </div>
        </div>
    );
}

function ContactProfileEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3">
                <Phone className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
                Impossible de charger les informations du profil.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
                Vérifiez que l'instance est connectée et réessayez.
            </p>
        </div>
    );
}

function ProfileRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <span className="text-muted-foreground">{icon}</span>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    );
}
