# Workspace Roles & Permissions

## Overview

Each workspace (team) has a role-based access control system. Roles define what actions a member can perform within the workspace. The system uses the `jurager/teams` package.

## Built-in Roles

| Role   | Code     | Description                                  |
| ------ | -------- | -------------------------------------------- |
| Owner  | `owner`  | Full access to all features and settings     |
| Admin  | `admin`  | Can manage team and most features            |
| Member | `member` | Can view and edit leads                      |
| Viewer | `viewer` | Read-only access                             |

## Permission Groups

| Group              | Key        | Permissions                                                 |
| ------------------ | ---------- | ----------------------------------------------------------- |
| Leads              | `leads`    | `view`, `create`, `edit`, `delete`                          |
| Instances          | `instances`| `view`, `create`, `edit`, `delete`                          |
| Agents             | `agents`   | `view`, `create`, `edit`, `delete`                          |
| Reports            | `reports`  | `view`, `export`                                            |
| Team Management    | `team`     | `manage`, `invite`, `roles`                                 |

## Permission Notation

- **Dot notation**: `leads.view`, `instances.create`, `reports.export`
- **Wildcard per group**: `leads.*` (all lead permissions)
- **Global wildcard**: `*` (all permissions, owner only)

## Default Role Permissions

| Code     | Permissions                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
| `owner`  | `*`                                                                                      |
| `admin`  | `leads.*`, `instances.*`, `agents.*`, `reports.view`, `reports.export`, `team.manage`, `team.invite`, `team.roles` |
| `member` | `leads.view`, `leads.edit`, `instances.view`, `agents.view`, `agents.create`, `reports.view` |
| `viewer` | `leads.view`, `instances.view`, `reports.view`                                           |

## Custom Roles

Custom roles can be created via the workspace Roles tab. They allow selecting specific permission checkboxes per group.

### Restrictions
- The `owner` role cannot be deleted (code-based guard).
- Only `owner` and `admin` roles can manage roles and invite members.
- Members inherit permissions based on their assigned role.

## Role Assignment

When a user is invited to a workspace, they are assigned a role. The role determines what they can see and do.

### Authorization helper

PHP: `$team->userAuthorization($user)` returns the user's role in the team.

Frontend: `canManageTeam` and `canInvite` props are derived from `in_array($role?->code, ['owner', 'admin'])`.

## Key Files

| File | Purpose |
| ---- | ------- |
| `app/Services/TeamService.php` | Creates default roles on workspace creation |
| `app/Http/Controllers/Team/TeamRoleController.php` | CRUD for roles |
| `app/Http/Controllers/Team/TeamController.php` | `show()` maps roles with permissions for frontend |
| `resources/js/types/workspace.ts` | TypeScript types for `WorkspaceRole`, `PERMISSION_GROUPS`, `DEFAULT_PERMISSIONS` |
| `resources/js/pages/Workspace/Partials/WorkspaceRoles.tsx` | Role management UI component |

## Notes

- Role `code` must be unique within a workspace.
- Permission strings use dot notation with optional wildcards.
- The `owner` role's user_id on the `teams` table grants ownership implicitly.
- Custom roles are stored in the `roles` table via the package.
- Role-permission relationships use a polymorphic pivot table (`entity_permission`).
