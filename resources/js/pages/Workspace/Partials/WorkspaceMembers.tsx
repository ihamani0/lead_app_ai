import { useForm } from '@inertiajs/react';
import { UserPlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import { invite as teamsInvite } from '@/routes/teams';
import type { Workspace, WorkspaceMember, WorkspaceRole } from '@/types';

interface WorkspaceMembersProps {
    workspace: Workspace;
    members: WorkspaceMember[];
    roles: WorkspaceRole[];
    canInvite: boolean;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function WorkspaceMembers({
    workspace,
    members,
    roles,
    canInvite,
}: WorkspaceMembersProps) {
    const { t } = useTranslation();
    const [inviteOpen, setInviteOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role_code: '',
    });

    const handleInvite = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(teamsInvite({ slug: workspace.slug }).url, {
            onSuccess: () => {
                setInviteOpen(false);
                reset();
            },
        });
    };

    const roleColors: Record<string, string> = {
        owner: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        admin: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        member: 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
        viewer: 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
    };

    return (
        <div className="space-y-4">
            {/* Header with Invite Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        {t('workspace.members.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t('workspace.members.description', {
                            count: members.length,
                        })}
                    </p>
                </div>

                {canInvite && (
                    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="size-4" />
                                {t('workspace.members.invite')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {t('workspace.members.invite_title')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t('workspace.members.invite_description')}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t('workspace.members.email')}
                                    </label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="email@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t('workspace.members.role')}
                                    </label>
                                    <Select
                                        value={data.role_code}
                                        onValueChange={(value) =>
                                            setData('role_code', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'workspace.members.select_role',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.code}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role_code && (
                                        <p className="text-sm text-destructive">
                                            {errors.role_code}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setInviteOpen(false)}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {t('workspace.members.send_invite')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Members Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {t('workspace.members.table.member')}
                            </TableHead>
                            <TableHead>
                                {t('workspace.members.table.role')}
                            </TableHead>
                            <TableHead>
                                {t('workspace.members.table.joined')}
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(member.user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {member.user?.name }
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {member.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            roleColors[member.role.code] || ''
                                        }
                                    >
                                        {member.role.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(
                                        member.created_at,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {member.role.code !== 'owner' &&
                                        canInvite && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 size-4" />
                                                        {t(
                                                            'workspace.members.remove',
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}



                    </TableBody>
                </Table>

                {members.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            {t('workspace.members.empty')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
