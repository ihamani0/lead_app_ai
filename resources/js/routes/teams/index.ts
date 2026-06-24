import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import invitations from './invitations'
import members from './members'
import roles from './roles'
/**
* @see \App\Http\Controllers\Team\TeamController::invite
* @see app/Http/Controllers/Team/TeamController.php:221
* @route '/workspaces/{slug}/invite'
*/
export const invite = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

invite.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Team\TeamController::invite
* @see app/Http/Controllers/Team/TeamController.php:221
* @route '/workspaces/{slug}/invite'
*/
invite.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return invite.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::invite
* @see app/Http/Controllers/Team/TeamController.php:221
* @route '/workspaces/{slug}/invite'
*/
invite.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Team\TeamController::index
* @see app/Http/Controllers/Team/TeamController.php:20
* @route '/workspaces'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Team\TeamController::index
* @see app/Http/Controllers/Team/TeamController.php:20
* @route '/workspaces'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::index
* @see app/Http/Controllers/Team/TeamController.php:20
* @route '/workspaces'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Team\TeamController::index
* @see app/Http/Controllers/Team/TeamController.php:20
* @route '/workspaces'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Team\TeamController::store
* @see app/Http/Controllers/Team/TeamController.php:74
* @route '/workspaces'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Team\TeamController::store
* @see app/Http/Controllers/Team/TeamController.php:74
* @route '/workspaces'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::store
* @see app/Http/Controllers/Team/TeamController.php:74
* @route '/workspaces'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Team\TeamController::show
* @see app/Http/Controllers/Team/TeamController.php:102
* @route '/workspaces/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Team\TeamController::show
* @see app/Http/Controllers/Team/TeamController.php:102
* @route '/workspaces/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::show
* @see app/Http/Controllers/Team/TeamController.php:102
* @route '/workspaces/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Team\TeamController::show
* @see app/Http/Controllers/Team/TeamController.php:102
* @route '/workspaces/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Team\TeamController::update
* @see app/Http/Controllers/Team/TeamController.php:177
* @route '/workspaces/{slug}'
*/
export const update = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Team\TeamController::update
* @see app/Http/Controllers/Team/TeamController.php:177
* @route '/workspaces/{slug}'
*/
update.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::update
* @see app/Http/Controllers/Team/TeamController.php:177
* @route '/workspaces/{slug}'
*/
update.put = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Team\TeamController::destroy
* @see app/Http/Controllers/Team/TeamController.php:203
* @route '/workspaces/{slug}'
*/
export const destroy = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Team\TeamController::destroy
* @see app/Http/Controllers/Team/TeamController.php:203
* @route '/workspaces/{slug}'
*/
destroy.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Team\TeamController::destroy
* @see app/Http/Controllers/Team/TeamController.php:203
* @route '/workspaces/{slug}'
*/
destroy.delete = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const teams = {
    invitations: Object.assign(invitations, invitations),
    invite: Object.assign(invite, invite),
    members: Object.assign(members, members),
    roles: Object.assign(roles, roles),
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default teams