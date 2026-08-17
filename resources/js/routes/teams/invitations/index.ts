import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Team\TeamInvitationController::accept
* @see app/Http/Controllers/Team/TeamInvitationController.php:45
* @route '/invitation/{invitation}/accept'
*/
export const accept = (args: { invitation: number | { id: number } } | [invitation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: '/invitation/{invitation}/accept',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::accept
* @see app/Http/Controllers/Team/TeamInvitationController.php:45
* @route '/invitation/{invitation}/accept'
*/
accept.url = (args: { invitation: number | { id: number } } | [invitation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invitation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invitation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invitation: typeof args.invitation === 'object'
        ? args.invitation.id
        : args.invitation,
    }

    return accept.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::accept
* @see app/Http/Controllers/Team/TeamInvitationController.php:45
* @route '/invitation/{invitation}/accept'
*/
accept.get = (args: { invitation: number | { id: number } } | [invitation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::accept
* @see app/Http/Controllers/Team/TeamInvitationController.php:45
* @route '/invitation/{invitation}/accept'
*/
accept.head = (args: { invitation: number | { id: number } } | [invitation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::destroy
* @see app/Http/Controllers/Team/TeamInvitationController.php:22
* @route '/workspaces/{slug}/invitations/{invitation}'
*/
export const destroy = (args: { slug: string | number, invitation: number | { id: number } } | [slug: string | number, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::destroy
* @see app/Http/Controllers/Team/TeamInvitationController.php:22
* @route '/workspaces/{slug}/invitations/{invitation}'
*/
destroy.url = (args: { slug: string | number, invitation: number | { id: number } } | [slug: string | number, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            invitation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        invitation: typeof args.invitation === 'object'
        ? args.invitation.id
        : args.invitation,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamInvitationController::destroy
* @see app/Http/Controllers/Team/TeamInvitationController.php:22
* @route '/workspaces/{slug}/invitations/{invitation}'
*/
destroy.delete = (args: { slug: string | number, invitation: number | { id: number } } | [slug: string | number, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const invitations = {
    accept: Object.assign(accept, accept),
    destroy: Object.assign(destroy, destroy),
}

export default invitations