import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KnowledgeBaseController::download
* @see app/Http/Controllers/KnowledgeBaseController.php:79
* @route '/workspaces/{slug}/knowledge/download/{id}'
*/
export const download = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/knowledge/download/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KnowledgeBaseController::download
* @see app/Http/Controllers/KnowledgeBaseController.php:79
* @route '/workspaces/{slug}/knowledge/download/{id}'
*/
download.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KnowledgeBaseController::download
* @see app/Http/Controllers/KnowledgeBaseController.php:79
* @route '/workspaces/{slug}/knowledge/download/{id}'
*/
download.get = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KnowledgeBaseController::download
* @see app/Http/Controllers/KnowledgeBaseController.php:79
* @route '/workspaces/{slug}/knowledge/download/{id}'
*/
download.head = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

const web = {
    download: Object.assign(download, download),
}

export default web