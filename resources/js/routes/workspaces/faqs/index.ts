import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FaqController::index
* @see app/Http/Controllers/FaqController.php:17
* @route '/workspaces/{slug}/faqs'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/faqs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FaqController::index
* @see app/Http/Controllers/FaqController.php:17
* @route '/workspaces/{slug}/faqs'
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
* @see \App\Http\Controllers\FaqController::index
* @see app/Http/Controllers/FaqController.php:17
* @route '/workspaces/{slug}/faqs'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FaqController::index
* @see app/Http/Controllers/FaqController.php:17
* @route '/workspaces/{slug}/faqs'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FaqController::store
* @see app/Http/Controllers/FaqController.php:47
* @route '/workspaces/{slug}/faqs'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/faqs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaqController::store
* @see app/Http/Controllers/FaqController.php:47
* @route '/workspaces/{slug}/faqs'
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
* @see \App\Http\Controllers\FaqController::store
* @see app/Http/Controllers/FaqController.php:47
* @route '/workspaces/{slug}/faqs'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FaqController::analyze
* @see app/Http/Controllers/FaqController.php:111
* @route '/workspaces/{slug}/faqs/analyze'
*/
export const analyze = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(args, options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/faqs/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaqController::analyze
* @see app/Http/Controllers/FaqController.php:111
* @route '/workspaces/{slug}/faqs/analyze'
*/
analyze.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return analyze.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaqController::analyze
* @see app/Http/Controllers/FaqController.php:111
* @route '/workspaces/{slug}/faqs/analyze'
*/
analyze.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FaqController::update
* @see app/Http/Controllers/FaqController.php:63
* @route '/workspaces/{slug}/faqs/{faq}'
*/
export const update = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/faqs/{faq}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FaqController::update
* @see app/Http/Controllers/FaqController.php:63
* @route '/workspaces/{slug}/faqs/{faq}'
*/
update.url = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            faq: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        faq: typeof args.faq === 'object'
        ? args.faq.id
        : args.faq,
    }

    return update.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{faq}', parsedArgs.faq.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaqController::update
* @see app/Http/Controllers/FaqController.php:63
* @route '/workspaces/{slug}/faqs/{faq}'
*/
update.put = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FaqController::destroy
* @see app/Http/Controllers/FaqController.php:78
* @route '/workspaces/{slug}/faqs/{faq}'
*/
export const destroy = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/faqs/{faq}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FaqController::destroy
* @see app/Http/Controllers/FaqController.php:78
* @route '/workspaces/{slug}/faqs/{faq}'
*/
destroy.url = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            faq: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        faq: typeof args.faq === 'object'
        ? args.faq.id
        : args.faq,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{faq}', parsedArgs.faq.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaqController::destroy
* @see app/Http/Controllers/FaqController.php:78
* @route '/workspaces/{slug}/faqs/{faq}'
*/
destroy.delete = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FaqController::toggle
* @see app/Http/Controllers/FaqController.php:88
* @route '/workspaces/{slug}/faqs/{faq}/toggle'
*/
export const toggle = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/faqs/{faq}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaqController::toggle
* @see app/Http/Controllers/FaqController.php:88
* @route '/workspaces/{slug}/faqs/{faq}/toggle'
*/
toggle.url = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            faq: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        faq: typeof args.faq === 'object'
        ? args.faq.id
        : args.faq,
    }

    return toggle.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{faq}', parsedArgs.faq.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaqController::toggle
* @see app/Http/Controllers/FaqController.php:88
* @route '/workspaces/{slug}/faqs/{faq}/toggle'
*/
toggle.post = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FaqController::accept
* @see app/Http/Controllers/FaqController.php:98
* @route '/workspaces/{slug}/faqs/{faq}/accept'
*/
export const accept = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/faqs/{faq}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaqController::accept
* @see app/Http/Controllers/FaqController.php:98
* @route '/workspaces/{slug}/faqs/{faq}/accept'
*/
accept.url = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            faq: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        faq: typeof args.faq === 'object'
        ? args.faq.id
        : args.faq,
    }

    return accept.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{faq}', parsedArgs.faq.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaqController::accept
* @see app/Http/Controllers/FaqController.php:98
* @route '/workspaces/{slug}/faqs/{faq}/accept'
*/
accept.post = (args: { slug: string | number, faq: string | number | { id: string | number } } | [slug: string | number, faq: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

const faqs = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    analyze: Object.assign(analyze, analyze),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    toggle: Object.assign(toggle, toggle),
    accept: Object.assign(accept, accept),
}

export default faqs