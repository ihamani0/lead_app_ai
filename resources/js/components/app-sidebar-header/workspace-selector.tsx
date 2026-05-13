import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Check, Plus, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { index as teamsIndex, show as teamsShow } from '@/routes/teams';
import type { Workspace } from '@/types';

type PageProps = {
    currentWorkspace?: Workspace;
    workspaces?: Workspace[];
};

export function WorkspaceSelector() {
    const { t } = useTranslation();
    const page = usePage<PageProps>();
    const { currentWorkspace, workspaces = [] } = page.props;

    if (!currentWorkspace) {
        return (
            <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href={teamsIndex().url}>
                    <Briefcase className="size-4" />
                    <span>{t('workspace.title')}</span>
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[200px] justify-start gap-2"
                >
                    <Avatar className="size-5">
                        <AvatarFallback className="text-[10px]">
                            {currentWorkspace.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-left">
                        {currentWorkspace.name}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[250px]">
                <DropdownMenuLabel>{t('workspace.title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {workspaces.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace.id}
                        asChild
                        className={cn(
                            'cursor-pointer',
                            currentWorkspace?.id === workspace.id &&
                                'bg-accent',
                        )}
                    >
                        <Link
                            href={teamsShow({ team: workspace.id }).url}
                            className="flex items-center gap-2"
                        >
                            <Avatar className="size-6">
                                <AvatarFallback className="text-xs">
                                    {workspace.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm">
                                    {workspace.name}
                                </span>
                                {workspace.user_role && (
                                    <span className="text-xs text-muted-foreground">
                                        {workspace.user_role.name}
                                    </span>
                                )}
                            </div>
                            {currentWorkspace?.id === workspace.id && (
                                <Check className="ml-auto size-4" />
                            )}
                        </Link>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                        href={teamsIndex().url}
                        className="flex items-center gap-2"
                    >
                        <Plus className="size-4" />
                        <span>{t('workspace.create')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
