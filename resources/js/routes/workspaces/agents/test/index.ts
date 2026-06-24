import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TestAiController::send
* @see app/Http/Controllers/TestAiController.php:16
* @route '/workspaces/{slug}/agents/{agent}/test/send'
*/
export const send = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/test/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestAiController::send
* @see app/Http/Controllers/TestAiController.php:16
* @route '/workspaces/{slug}/agents/{agent}/test/send'
*/
send.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestAiController::send
* @see app/Http/Controllers/TestAiController.php:16
* @route '/workspaces/{slug}/agents/{agent}/test/send'
*/
send.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TestAiController::clear
* @see app/Http/Controllers/TestAiController.php:99
* @route '/workspaces/{slug}/agents/{agent}/test/clear'
*/
export const clear = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(args, options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/test/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TestAiController::clear
* @see app/Http/Controllers/TestAiController.php:99
* @route '/workspaces/{slug}/agents/{agent}/test/clear'
*/
clear.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return clear.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TestAiController::clear
* @see app/Http/Controllers/TestAiController.php:99
* @route '/workspaces/{slug}/agents/{agent}/test/clear'
*/
clear.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(args, options),
    method: 'post',
})

const test = {
    send: Object.assign(send, send),
    clear: Object.assign(clear, clear),
}

export default test