import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:471
* @route '/workspaces/{slug}/wizard'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/wizard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:471
* @route '/workspaces/{slug}/wizard'
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
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:471
* @route '/workspaces/{slug}/wizard'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:471
* @route '/workspaces/{slug}/wizard'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgentController::instance
* @see app/Http/Controllers/AgentController.php:483
* @route '/workspaces/{slug}/wizard/instance'
*/
export const instance = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: instance.url(args, options),
    method: 'post',
})

instance.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/wizard/instance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::instance
* @see app/Http/Controllers/AgentController.php:483
* @route '/workspaces/{slug}/wizard/instance'
*/
instance.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return instance.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::instance
* @see app/Http/Controllers/AgentController.php:483
* @route '/workspaces/{slug}/wizard/instance'
*/
instance.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: instance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:513
* @route '/workspaces/{slug}/wizard/qr'
*/
export const qr = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(args, options),
    method: 'post',
})

qr.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/wizard/qr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:513
* @route '/workspaces/{slug}/wizard/qr'
*/
qr.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return qr.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:513
* @route '/workspaces/{slug}/wizard/qr'
*/
qr.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::complete
* @see app/Http/Controllers/AgentController.php:537
* @route '/workspaces/{slug}/wizard/complete'
*/
export const complete = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/wizard/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::complete
* @see app/Http/Controllers/AgentController.php:537
* @route '/workspaces/{slug}/wizard/complete'
*/
complete.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return complete.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::complete
* @see app/Http/Controllers/AgentController.php:537
* @route '/workspaces/{slug}/wizard/complete'
*/
complete.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::dismissWelcome
* @see app/Http/Controllers/AgentController.php:646
* @route '/workspaces/{slug}/wizard/dismiss-welcome'
*/
export const dismissWelcome = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismissWelcome.url(args, options),
    method: 'post',
})

dismissWelcome.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/wizard/dismiss-welcome',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::dismissWelcome
* @see app/Http/Controllers/AgentController.php:646
* @route '/workspaces/{slug}/wizard/dismiss-welcome'
*/
dismissWelcome.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return dismissWelcome.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::dismissWelcome
* @see app/Http/Controllers/AgentController.php:646
* @route '/workspaces/{slug}/wizard/dismiss-welcome'
*/
dismissWelcome.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismissWelcome.url(args, options),
    method: 'post',
})

const wizard = {
    index: Object.assign(index, index),
    instance: Object.assign(instance, instance),
    qr: Object.assign(qr, qr),
    complete: Object.assign(complete, complete),
    dismissWelcome: Object.assign(dismissWelcome, dismissWelcome),
}

export default wizard