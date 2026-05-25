import { Link, router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, Check, Plus, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import { index as teamsIndex } from '@/routes/teams';
import workspacesRoutes from '@/routes/workspaces';
import type { Workspace } from '@/types';

type PageProps = {
    auth: {
        user: {
            tenant: {
                plan: string;
            };
        };
        workspaces?: Workspace[];
    };
};

export function WorkspaceSelector() {
    const { t } = useTranslation();
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const activeWorkspace = useActiveWorkspace();
    const [open, setOpen] = useState(false);

    const plan = auth?.user?.tenant?.plan ?? '';
    const workspaces = auth?.workspaces ?? [];

    if (!activeWorkspace) {
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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-[200px] justify-between gap-2"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-5 shrink-0">
                            <AvatarFallback className="text-[10px]">
                                {activeWorkspace.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                            {activeWorkspace.name}
                        </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        {plan && (
                            <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px] font-semibold uppercase"
                            >
                                {plan}
                            </Badge>
                        )}
                        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[280px] p-0">
                <Command>
                    <CommandInput placeholder={t('workspace.search', 'Find organization...')} />
                    <CommandList>
                        <CommandEmpty>
                            {t('workspace.no_results', 'No organization found.')}
                        </CommandEmpty>
                        <CommandGroup heading={t('workspace.title')}>
                            {workspaces.map((workspace) => (
                                <CommandItem
                                    key={workspace.id}
                                    value={workspace.name}
                                    onSelect={() => {
                                        setOpen(false);
                                        if (workspace.id !== activeWorkspace.id) {
                                            router.visit(workspacesRoutes.dashboard({ slug: workspace.slug }));
                                        }
                                    }}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <Avatar className="size-6 shrink-0">
                                            <AvatarFallback className="text-xs">
                                                {workspace.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="text-sm font-medium">
                                                {workspace.name}
                                            </span>
                                            {workspace.description && (
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {workspace.description}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1.5">
                                            {plan && (
                                                <Badge
                                                    variant="secondary"
                                                    className="px-1.5 py-0 text-[10px] font-semibold uppercase"
                                                >
                                                    {plan}
                                                </Badge>
                                            )}
                                            {activeWorkspace.id === workspace.id && (
                                                <Check className="size-4 text-primary" />
                                            )}
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandItem
                            onSelect={() => {
                                setOpen(false);
                            }}
                            asChild
                        >
                            <Link
                                href={teamsIndex().url}
                                className="flex items-center gap-2"
                            >
                                <Plus className="size-4" />
                                <span>{t('workspace.create')}</span>
                            </Link>
                        </CommandItem>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
