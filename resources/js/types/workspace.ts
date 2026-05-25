import type { User } from './auth';

export interface Workspace {
    id: string;
    name: string;
    description: string | null;
    owner_id: number;
    tenant_id: string;
    created_at: string;
    updated_at: string;
    owner?: User;
    members_count?: number;
    user_role?: WorkspaceRole;
    slug: string;
}

export interface WorkspaceMember {
    id: number;
    user_id: number;
    workspace_id: string;
    role_id: number;
    user: User;
    role: WorkspaceRole;
    created_at: string;
}

export interface WorkspaceRole {
    id: number;
    workspace_id: string;
    name: string;
    code: string;
    description: string | null;
    permissions: {
        code: string;
        name: string;
    }[];
    is_default?: boolean;
}

export interface WorkspaceInvitation {
    id: number;
    email: string;
    role_id: number;
    role?: WorkspaceRole;
    team_id: number;
}

export type { User } from './auth';

export type { User as WorkspaceUser } from './auth';

export interface WorkspacePermissions {
    leads: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    instances: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    agents: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    reports: {
        view: boolean;
        export: boolean;
    };
    team: {
        manage: boolean;
        invite: boolean;
        roles: boolean;
    };
}

export const DEFAULT_PERMISSIONS: Record<string, string[]> = {
    owner: ['*'],
    admin: [
        'leads.*',
        'instances.*',
        'agents.*',
        'media.*',
        'reports.*',
        'knowledge.*',
        'team.*',
    ],
    member: [
        'leads.view',
        'instances.*',
        'agents.*',
        'media.view',
        'reports.view',
        'knowledge.view',
    ],
    viewer: [
        'leads.view',
        'instances.view',
        'agents.view',
        'media.view',
        'reports.view',
        'knowledge.view',
    ],
};

export const PERMISSION_GROUPS: {
    name: string;
    key: string;
    permissions: readonly string[];
    wildcard: string;
}[] = [
    {
        name: 'Leads',
        key: 'leads',
        permissions: ['view', 'create', 'edit', 'delete'] as const,
        wildcard: 'leads.*',
    },
    {
        name: 'Instances',
        key: 'instances',
        permissions: ['view', 'create', 'edit', 'delete'] as const,
        wildcard: 'instances.*',
    },
    {
        name: 'Agents',
        key: 'agents',
        permissions: ['view', 'create', 'edit', 'delete'] as const,
        wildcard: 'agents.*',
    },
    {
        name: 'Reports',
        key: 'reports',
        permissions: ['view', 'export'] as const,
        wildcard: 'reports.*',
    },
    {
        name: 'Team Management',
        key: 'team',
        permissions: ['manage', 'invite', 'roles'] as const,
        wildcard: 'team.*',
    },
] as const;
