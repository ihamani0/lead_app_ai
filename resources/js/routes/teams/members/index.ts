import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Team\TeamMemberController::updateRole
* @see app/Http/Controllers/Team/TeamMemberController.php:90
* @route '/workspaces/{slug}/members/{user}'
*/
export const updateRole = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

updateRole.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/members/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Team\TeamMemberController::updateRole
* @see app/Http/Controllers/Team/TeamMemberController.php:90
* @route '/workspaces/{slug}/members/{user}'
*/
updateRole.url = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateRole.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamMemberController::updateRole
* @see app/Http/Controllers/Team/TeamMemberController.php:90
* @route '/workspaces/{slug}/members/{user}'
*/
updateRole.put = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Team\TeamMemberController::destroy
* @see app/Http/Controllers/Team/TeamMemberController.php:126
* @route '/workspaces/{slug}/members/{user}'
*/
export const destroy = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Team\TeamMemberController::destroy
* @see app/Http/Controllers/Team/TeamMemberController.php:126
* @route '/workspaces/{slug}/members/{user}'
*/
destroy.url = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamMemberController::destroy
* @see app/Http/Controllers/Team/TeamMemberController.php:126
* @route '/workspaces/{slug}/members/{user}'
*/
destroy.delete = (args: { slug: string | number, user: string | number | { id: string | number } } | [slug: string | number, user: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const members = {
    updateRole: Object.assign(updateRole, updateRole),
    destroy: Object.assign(destroy, destroy),
}

export default members