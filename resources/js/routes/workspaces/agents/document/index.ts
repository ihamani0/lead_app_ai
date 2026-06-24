import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}/download'
*/
export const download = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/agents/{agent}/knowledge/{id}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}/download'
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
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}/download'
*/
download.get = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::download
* @see app/Http/Controllers/AgentController.php:457
* @route '/workspaces/{slug}/agents/{agent}/knowledge/{id}/download'
*/
download.head = (args: { slug: string | number, agent: string | number, id: string | number } | [slug: string | number, agent: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

const document = {
    download: Object.assign(download, download),
}

export default document