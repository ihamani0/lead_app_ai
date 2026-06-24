import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/api/n8n/workspaces/{slug}/agents/{agent}/download/{id}'
*/
export const download = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/n8n/workspaces/{slug}/agents/{agent}/download/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/api/n8n/workspaces/{slug}/agents/{agent}/download/{id}'
*/
download.url = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            agent: args[1],
            id: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        agent: args.agent,
        id: args.id,
    }

    return download.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/api/n8n/workspaces/{slug}/agents/{agent}/download/{id}'
*/
download.get = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/api/n8n/workspaces/{slug}/agents/{agent}/download/{id}'
*/
download.head = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:410
* @route '/workspaces/{slug}/agents/{agent}/knowledge'
*/
export const store = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/knowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:410
* @route '/workspaces/{slug}/agents/{agent}/knowledge'
*/
store.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            agent: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        agent: args.agent,
    }

    return store.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:410
* @route '/workspaces/{slug}/agents/{agent}/knowledge'
*/
store.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:440
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}'
*/
export const destroy = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/agents/{agent}/knowledge/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:440
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}'
*/
destroy.url = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            agent: args[1],
            id: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        agent: args.agent,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:440
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}'
*/
destroy.delete = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const knowledge = {
    download: Object.assign(download, download),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default knowledge