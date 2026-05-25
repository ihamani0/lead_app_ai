import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { Workspace, WorkspaceMember, WorkspaceRole } from '@/types';
import { TabNavigation } from './Partials/TabNavigation';
import { WorkspaceOverview } from './Partials/WorkspaceOverview';
import { WorkspaceRoles } from './Partials/WorkspaceRoles';
import { WorkspaceSettings } from './Partials/WorkspaceSettings';

interface WorkspaceShowProps {
    workspace: Workspace & { users_count?: number };
    workspaceRole: { code?: string; name?: string; description?: string } | null;
    members: WorkspaceMember[];
    roles: WorkspaceRole[];
    canManageTeam: boolean;
    canInvite: boolean;
}

type TabType = 'overview' | 'roles' | 'settings';

export default function WorkspaceShow({
    workspace,
    workspaceRole,
    members,
    roles,
    canManageTeam,
}: WorkspaceShowProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const workspaceWithMeta = {
        ...workspace,
        members_count: members.length,
        user_role: workspaceRole
            ? {
                  code: workspaceRole.code ?? '',
                  name: workspaceRole.name ?? workspaceRole.code ?? '',
                  description: workspaceRole.description ?? '',
              }
            : undefined,
    } as Workspace;

    const tabs: { id: TabType; label: string; visible: boolean }[] = [
        { id: 'overview', label: t('workspace.tabs.overview'), visible: true },
        { id: 'roles', label: t('workspace.tabs.roles'), visible: canManageTeam },
        {
            id: 'settings',
            label: t('workspace.tabs.settings'),
            visible: canManageTeam,
        },
    ];

    const visibleTabs = tabs.filter((tab) => tab.visible);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <WorkspaceOverview workspace={workspaceWithMeta} />;
            case 'roles':
                return <WorkspaceRoles workspace={workspace} roles={roles} />;
            case 'settings':
                return <WorkspaceSettings workspace={workspace} />;
            default:
                return <WorkspaceOverview workspace={workspaceWithMeta} />;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: t('workspace.title'),
                    href: '#',
                },
                {
                    title: workspace.name,
                    href: '#',
                },
            ]}
        >
            <Head title={workspace.name} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">
                            {workspace.name}
                        </h1>
                        {workspace.description && (
                            <p className="mt-1 text-sm text-muted-foreground md:text-base">
                                {workspace.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <TabNavigation
                    tabs={visibleTabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Content */}
                <div className="min-h-[400px]">{renderContent()}</div>
            </div>
        </AppLayout>
    );
}
