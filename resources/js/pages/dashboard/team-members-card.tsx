import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
    id: number;
    name: string;
    initials: string;
    role: string;
    is_current_user: boolean;
    color: string;
}

interface TeamMembersCardProps {
    members: Member[];
}

const avatarColors: Record<string, { bg: string; text: string }> = {
    purple: {
        bg: 'bg-violet-100 dark:bg-violet-900/50',
        text: 'text-violet-700 dark:text-violet-300',
    },
    teal: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/50',
        text: 'text-emerald-700 dark:text-emerald-300',
    },
    coral: {
        bg: 'bg-orange-100 dark:bg-orange-900/50',
        text: 'text-orange-700 dark:text-orange-300',
    },
    blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-700 dark:text-blue-300',
    },
    amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/50',
        text: 'text-amber-700 dark:text-amber-300',
    },
};

function Avatar({ initials, color }: { initials: string; color: string }) {
    const colors = avatarColors[color] ?? avatarColors.purple;

    return (
        <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
        >
            {initials}
        </div>
    );
}

export function TeamMembersCard({ members }: TeamMembersCardProps) {
    const displayMembers = members.slice(0, 5);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        Membres de l'équipe
                    </CardTitle>
                    {members.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                            +{members.length - 5} autres
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
                <div className="flex flex-col gap-0 divide-y">
                    {displayMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 py-2.5"
                        >
                            <Avatar
                                initials={member.initials}
                                color={member.color}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {member.role}
                                </p>
                            </div>
                            {member.is_current_user && (
                                <Badge
                                    variant="outline"
                                    className="border-violet-200 bg-violet-50 text-xs text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400"
                                >
                                    Vous
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
