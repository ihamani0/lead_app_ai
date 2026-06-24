import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import web from './web'
/**
* @see \App\Http\Controllers\KnowledgeBaseController::index
* @see app/Http/Controllers/KnowledgeBaseController.php:16
* @route '/workspaces/{slug}/knowledge'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/knowledge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KnowledgeBaseController::index
* @see app/Http/Controllers/KnowledgeBaseController.php:16
* @route '/workspaces/{slug}/knowledge'
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
* @see \App\Http\Controllers\KnowledgeBaseController::index
* @see app/Http/Controllers/KnowledgeBaseController.php:16
* @route '/workspaces/{slug}/knowledge'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KnowledgeBaseController::index
* @see app/Http/Controllers/KnowledgeBaseController.php:16
* @route '/workspaces/{slug}/knowledge'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KnowledgeBaseController::store
* @see app/Http/Controllers/KnowledgeBaseController.php:44
* @route '/workspaces/{slug}/knowledge'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/knowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KnowledgeBaseController::store
* @see app/Http/Controllers/KnowledgeBaseController.php:44
* @route '/workspaces/{slug}/knowledge'
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
* @see \App\Http\Controllers\KnowledgeBaseController::store
* @see app/Http/Controllers/KnowledgeBaseController.php:44
* @route '/workspaces/{slug}/knowledge'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KnowledgeBaseController::destroy
* @see app/Http/Controllers/KnowledgeBaseController.php:91
* @route '/workspaces/{slug}/knowledge/{id}'
*/
export const destroy = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/knowledge/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KnowledgeBaseController::destroy
* @see app/Http/Controllers/KnowledgeBaseController.php:91
* @route '/workspaces/{slug}/knowledge/{id}'
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
* @see \App\Http\Controllers\KnowledgeBaseController::destroy
* @see app/Http/Controllers/KnowledgeBaseController.php:91
* @route '/workspaces/{slug}/knowledge/{id}'
*/
destroy.delete = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const knowledge = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    web: Object.assign(web, web),
}

export default knowledge