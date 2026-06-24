import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:17
* @route '/workspaces/{slug}/media'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:17
* @route '/workspaces/{slug}/media'
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
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:17
* @route '/workspaces/{slug}/media'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MediaAssetController::index
* @see app/Http/Controllers/MediaAssetController.php:17
* @route '/workspaces/{slug}/media'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:80
* @route '/workspaces/{slug}/media'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:80
* @route '/workspaces/{slug}/media'
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
* @see \App\Http\Controllers\MediaAssetController::store
* @see app/Http/Controllers/MediaAssetController.php:80
* @route '/workspaces/{slug}/media'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::update
* @see app/Http/Controllers/MediaAssetController.php:57
* @route '/workspaces/{slug}/media/{id}'
*/
export const update = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/media/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MediaAssetController::update
* @see app/Http/Controllers/MediaAssetController.php:57
* @route '/workspaces/{slug}/media/{id}'
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
* @see \App\Http\Controllers\MediaAssetController::update
* @see app/Http/Controllers/MediaAssetController.php:57
* @route '/workspaces/{slug}/media/{id}'
*/
update.put = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:248
* @route '/workspaces/{slug}/media/{id}'
*/
export const destroy = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/media/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:248
* @route '/workspaces/{slug}/media/{id}'
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
* @see \App\Http\Controllers\MediaAssetController::destroy
* @see app/Http/Controllers/MediaAssetController.php:248
* @route '/workspaces/{slug}/media/{id}'
*/
destroy.delete = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MediaAssetController::toggleDefault
* @see app/Http/Controllers/MediaAssetController.php:44
* @route '/workspaces/{slug}/media/{id}/toggle-default'
*/
export const toggleDefault = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleDefault.url(args, options),
    method: 'post',
})

toggleDefault.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/media/{id}/toggle-default',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaAssetController::toggleDefault
* @see app/Http/Controllers/MediaAssetController.php:44
* @route '/workspaces/{slug}/media/{id}/toggle-default'
*/
toggleDefault.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
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

    return toggleDefault.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::toggleDefault
* @see app/Http/Controllers/MediaAssetController.php:44
* @route '/workspaces/{slug}/media/{id}/toggle-default'
*/
toggleDefault.post = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleDefault.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::presign
* @see app/Http/Controllers/MediaAssetController.php:125
* @route '/workspaces/{slug}/media/presign'
*/
export const presign = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: presign.url(args, options),
    method: 'post',
})

presign.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/media/presign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaAssetController::presign
* @see app/Http/Controllers/MediaAssetController.php:125
* @route '/workspaces/{slug}/media/presign'
*/
presign.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return presign.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::presign
* @see app/Http/Controllers/MediaAssetController.php:125
* @route '/workspaces/{slug}/media/presign'
*/
presign.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: presign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MediaAssetController::finalize
* @see app/Http/Controllers/MediaAssetController.php:172
* @route '/workspaces/{slug}/media/finalize'
*/
export const finalize = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/media/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaAssetController::finalize
* @see app/Http/Controllers/MediaAssetController.php:172
* @route '/workspaces/{slug}/media/finalize'
*/
finalize.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return finalize.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaAssetController::finalize
* @see app/Http/Controllers/MediaAssetController.php:172
* @route '/workspaces/{slug}/media/finalize'
*/
finalize.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

const media = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    toggleDefault: Object.assign(toggleDefault, toggleDefault),
    presign: Object.assign(presign, presign),
    finalize: Object.assign(finalize, finalize),
}

export default media