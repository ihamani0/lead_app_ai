import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Team\TeamRoleController::store
* @see app/Http/Controllers/Team/TeamRoleController.php:12
* @route '/workspaces/{slug}/roles'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Team\TeamRoleController::store
* @see app/Http/Controllers/Team/TeamRoleController.php:12
* @route '/workspaces/{slug}/roles'
*/
store.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return store.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamRoleController::store
* @see app/Http/Controllers/Team/TeamRoleController.php:12
* @route '/workspaces/{slug}/roles'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Team\TeamRoleController::update
* @see app/Http/Controllers/Team/TeamRoleController.php:48
* @route '/workspaces/{slug}/roles/{role}'
*/
export const update = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/roles/{role}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Team\TeamRoleController::update
* @see app/Http/Controllers/Team/TeamRoleController.php:48
* @route '/workspaces/{slug}/roles/{role}'
*/
update.url = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            role: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return update.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamRoleController::update
* @see app/Http/Controllers/Team/TeamRoleController.php:48
* @route '/workspaces/{slug}/roles/{role}'
*/
update.put = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Team\TeamRoleController::destroy
* @see app/Http/Controllers/Team/TeamRoleController.php:87
* @route '/workspaces/{slug}/roles/{role}'
*/
export const destroy = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Team\TeamRoleController::destroy
* @see app/Http/Controllers/Team/TeamRoleController.php:87
* @route '/workspaces/{slug}/roles/{role}'
*/
destroy.url = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            role: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamRoleController::destroy
* @see app/Http/Controllers/Team/TeamRoleController.php:87
* @route '/workspaces/{slug}/roles/{role}'
*/
destroy.delete = (args: { slug: string | number, role: string | number | { id: string | number } } | [slug: string | number, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const roles = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default roles