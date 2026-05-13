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
    workspace_id: string;
    email: string;
    role_id: number;
    token: string;
    expires_at: string;
    accepted_at: string | null;
    created_by: number;
    created_by_user?: User;
    role?: WorkspaceRole;
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
        'reports.view',
        'reports.export',
        'team.manage',
        'team.invite',
        'team.roles',
    ],
    member: [
        'leads.view',
        'leads.create',
        'leads.edit',
        'instances.view',
        'agents.view',
        'reports.view',
    ],
    viewer: ['leads.view', 'instances.view', 'reports.view'],
};

export const PERMISSION_GROUPS = [
    {
        name: 'Leads',
        key: 'leads',
        permissions: ['view', 'create', 'edit', 'delete'],
        wildcard: 'leads.*',
    },
    {
        name: 'Instances',
        key: 'instances',
        permissions: ['view', 'create', 'edit', 'delete'],
        wildcard: 'instances.*',
    },
    {
        name: 'Agents',
        key: 'agents',
        permissions: ['view', 'create', 'edit', 'delete'],
        wildcard: 'agents.*',
    },
    {
        name: 'Reports',
        key: 'reports',
        permissions: ['view', 'export'],
        wildcard: 'reports.*',
    },
    {
        name: 'Team Management',
        key: 'team',
        permissions: ['manage', 'invite', 'roles'],
        wildcard: 'team.*',
    },
] as const;
