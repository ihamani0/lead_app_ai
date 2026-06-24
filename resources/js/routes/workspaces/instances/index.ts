import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EvolutionInstanceController::index
* @see app/Http/Controllers/EvolutionInstanceController.php:22
* @route '/workspaces/{slug}/instances'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/instances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::index
* @see app/Http/Controllers/EvolutionInstanceController.php:22
* @route '/workspaces/{slug}/instances'
*/
index.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::index
* @see app/Http/Controllers/EvolutionInstanceController.php:22
* @route '/workspaces/{slug}/instances'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::index
* @see app/Http/Controllers/EvolutionInstanceController.php:22
* @route '/workspaces/{slug}/instances'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::store
* @see app/Http/Controllers/EvolutionInstanceController.php:63
* @route '/workspaces/{slug}/instances'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/instances',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::store
* @see app/Http/Controllers/EvolutionInstanceController.php:63
* @route '/workspaces/{slug}/instances'
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
* @see \App\Http\Controllers\EvolutionInstanceController::store
* @see app/Http/Controllers/EvolutionInstanceController.php:63
* @route '/workspaces/{slug}/instances'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::show
* @see app/Http/Controllers/EvolutionInstanceController.php:128
* @route '/workspaces/{slug}/instances/{id}'
*/
export const show = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/instances/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::show
* @see app/Http/Controllers/EvolutionInstanceController.php:128
* @route '/workspaces/{slug}/instances/{id}'
*/
show.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::show
* @see app/Http/Controllers/EvolutionInstanceController.php:128
* @route '/workspaces/{slug}/instances/{id}'
*/
show.get = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::show
* @see app/Http/Controllers/EvolutionInstanceController.php:128
* @route '/workspaces/{slug}/instances/{id}'
*/
show.head = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::fetchQr
* @see app/Http/Controllers/EvolutionInstanceController.php:153
* @route '/workspaces/{slug}/instances/{id}/qr'
*/
export const fetchQr = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchQr.url(args, options),
    method: 'post',
})

fetchQr.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/instances/{id}/qr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::fetchQr
* @see app/Http/Controllers/EvolutionInstanceController.php:153
* @route '/workspaces/{slug}/instances/{id}/qr'
*/
fetchQr.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return fetchQr.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::fetchQr
* @see app/Http/Controllers/EvolutionInstanceController.php:153
* @route '/workspaces/{slug}/instances/{id}/qr'
*/
fetchQr.post = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchQr.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::disconnect
* @see app/Http/Controllers/EvolutionInstanceController.php:183
* @route '/workspaces/{slug}/instances/{id}/disconnect'
*/
export const disconnect = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

disconnect.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/instances/{id}/disconnect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::disconnect
* @see app/Http/Controllers/EvolutionInstanceController.php:183
* @route '/workspaces/{slug}/instances/{id}/disconnect'
*/
disconnect.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return disconnect.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::disconnect
* @see app/Http/Controllers/EvolutionInstanceController.php:183
* @route '/workspaces/{slug}/instances/{id}/disconnect'
*/
disconnect.post = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restart
* @see app/Http/Controllers/EvolutionInstanceController.php:169
* @route '/workspaces/{slug}/instances/{id}/restart'
*/
export const restart = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restart.url(args, options),
    method: 'put',
})

restart.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/instances/{id}/restart',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restart
* @see app/Http/Controllers/EvolutionInstanceController.php:169
* @route '/workspaces/{slug}/instances/{id}/restart'
*/
restart.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return restart.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restart
* @see app/Http/Controllers/EvolutionInstanceController.php:169
* @route '/workspaces/{slug}/instances/{id}/restart'
*/
restart.put = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restart.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restore
* @see app/Http/Controllers/EvolutionInstanceController.php:290
* @route '/workspaces/{slug}/instances/{id}/restore'
*/
export const restore = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/instances/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restore
* @see app/Http/Controllers/EvolutionInstanceController.php:290
* @route '/workspaces/{slug}/instances/{id}/restore'
*/
restore.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return restore.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::restore
* @see app/Http/Controllers/EvolutionInstanceController.php:290
* @route '/workspaces/{slug}/instances/{id}/restore'
*/
restore.post = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::update
* @see app/Http/Controllers/EvolutionInstanceController.php:114
* @route '/workspaces/{slug}/instances/{id}'
*/
export const update = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/instances/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::update
* @see app/Http/Controllers/EvolutionInstanceController.php:114
* @route '/workspaces/{slug}/instances/{id}'
*/
update.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return update.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::update
* @see app/Http/Controllers/EvolutionInstanceController.php:114
* @route '/workspaces/{slug}/instances/{id}'
*/
update.put = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::destroy
* @see app/Http/Controllers/EvolutionInstanceController.php:226
* @route '/workspaces/{slug}/instances/{id}'
*/
export const destroy = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/instances/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::destroy
* @see app/Http/Controllers/EvolutionInstanceController.php:226
* @route '/workspaces/{slug}/instances/{id}'
*/
destroy.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::destroy
* @see app/Http/Controllers/EvolutionInstanceController.php:226
* @route '/workspaces/{slug}/instances/{id}'
*/
destroy.delete = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EvolutionInstanceController::forceDestroy
* @see app/Http/Controllers/EvolutionInstanceController.php:269
* @route '/workspaces/{slug}/instances/{id}/force'
*/
export const forceDestroy = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDestroy.url(args, options),
    method: 'delete',
})

forceDestroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/instances/{id}/force',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EvolutionInstanceController::forceDestroy
* @see app/Http/Controllers/EvolutionInstanceController.php:269
* @route '/workspaces/{slug}/instances/{id}/force'
*/
forceDestroy.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        id: args.id,
    }

    return forceDestroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvolutionInstanceController::forceDestroy
* @see app/Http/Controllers/EvolutionInstanceController.php:269
* @route '/workspaces/{slug}/instances/{id}/force'
*/
forceDestroy.delete = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDestroy.url(args, options),
    method: 'delete',
})

const instances = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    fetchQr: Object.assign(fetchQr, fetchQr),
    disconnect: Object.assign(disconnect, disconnect),
    restart: Object.assign(restart, restart),
    restore: Object.assign(restore, restore),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    forceDestroy: Object.assign(forceDestroy, forceDestroy),
}

export default instances