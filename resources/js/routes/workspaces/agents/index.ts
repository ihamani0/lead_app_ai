import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import knowledge from './knowledge'
import test from './test'
import document from './document'
/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:37
* @route '/workspaces/{slug}/agents'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/agents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:37
* @route '/workspaces/{slug}/agents'
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
* @see app/Http/Controllers/AgentController.php:37
* @route '/workspaces/{slug}/agents'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::index
* @see app/Http/Controllers/AgentController.php:37
* @route '/workspaces/{slug}/agents'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:101
* @route '/workspaces/{slug}/agents'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:101
* @route '/workspaces/{slug}/agents'
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
* @see \App\Http\Controllers\AgentController::store
* @see app/Http/Controllers/AgentController.php:101
* @route '/workspaces/{slug}/agents'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::promptHistory
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/prompt-history'
*/
export const promptHistory = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promptHistory.url(args, options),
    method: 'get',
})

promptHistory.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/agents/{agent}/prompt-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::promptHistory
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/prompt-history'
*/
promptHistory.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return promptHistory.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::promptHistory
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/prompt-history'
*/
promptHistory.get = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promptHistory.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::promptHistory
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/prompt-history'
*/
promptHistory.head = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: promptHistory.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgentController::linkInstance
* @see app/Http/Controllers/AgentController.php:259
* @route '/workspaces/{slug}/agents/{agent}/link-instance'
*/
export const linkInstance = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkInstance.url(args, options),
    method: 'post',
})

linkInstance.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/link-instance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::linkInstance
* @see app/Http/Controllers/AgentController.php:259
* @route '/workspaces/{slug}/agents/{agent}/link-instance'
*/
linkInstance.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return linkInstance.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::linkInstance
* @see app/Http/Controllers/AgentController.php:259
* @route '/workspaces/{slug}/agents/{agent}/link-instance'
*/
linkInstance.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkInstance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::unlinkInstance
* @see app/Http/Controllers/AgentController.php:285
* @route '/workspaces/{slug}/agents/{agent}/unlink-instance'
*/
export const unlinkInstance = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlinkInstance.url(args, options),
    method: 'post',
})

unlinkInstance.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/unlink-instance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::unlinkInstance
* @see app/Http/Controllers/AgentController.php:285
* @route '/workspaces/{slug}/agents/{agent}/unlink-instance'
*/
unlinkInstance.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return unlinkInstance.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::unlinkInstance
* @see app/Http/Controllers/AgentController.php:285
* @route '/workspaces/{slug}/agents/{agent}/unlink-instance'
*/
unlinkInstance.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlinkInstance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::clone
* @see app/Http/Controllers/AgentController.php:190
* @route '/workspaces/{slug}/agents/{agent}/clone'
*/
export const clone = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

clone.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::clone
* @see app/Http/Controllers/AgentController.php:190
* @route '/workspaces/{slug}/agents/{agent}/clone'
*/
clone.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return clone.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::clone
* @see app/Http/Controllers/AgentController.php:190
* @route '/workspaces/{slug}/agents/{agent}/clone'
*/
clone.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::toggle
* @see app/Http/Controllers/AgentController.php:205
* @route '/workspaces/{slug}/agents/{agent}/toggle'
*/
export const toggle = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/workspaces/{slug}/agents/{agent}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AgentController::toggle
* @see app/Http/Controllers/AgentController.php:205
* @route '/workspaces/{slug}/agents/{agent}/toggle'
*/
toggle.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return toggle.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::toggle
* @see app/Http/Controllers/AgentController.php:205
* @route '/workspaces/{slug}/agents/{agent}/toggle'
*/
toggle.patch = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AgentController::updateSettings
* @see app/Http/Controllers/AgentController.php:228
* @route '/workspaces/{slug}/agents/{agent}/settings'
*/
export const updateSettings = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSettings.url(args, options),
    method: 'patch',
})

updateSettings.definition = {
    methods: ["patch"],
    url: '/workspaces/{slug}/agents/{agent}/settings',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AgentController::updateSettings
* @see app/Http/Controllers/AgentController.php:228
* @route '/workspaces/{slug}/agents/{agent}/settings'
*/
updateSettings.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return updateSettings.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::updateSettings
* @see app/Http/Controllers/AgentController.php:228
* @route '/workspaces/{slug}/agents/{agent}/settings'
*/
updateSettings.patch = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSettings.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AgentController::resetPrompt
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/reset-prompt'
*/
export const resetPrompt = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPrompt.url(args, options),
    method: 'post',
})

resetPrompt.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/reset-prompt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::resetPrompt
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/reset-prompt'
*/
resetPrompt.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return resetPrompt.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::resetPrompt
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/reset-prompt'
*/
resetPrompt.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPrompt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::restoreIdentity
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/restore-identity/{version}'
*/
export const restoreIdentity = (args: { slug: string | number, agent: string | number, version: string | number } | [slug: string | number, agent: string | number, version: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreIdentity.url(args, options),
    method: 'post',
})

restoreIdentity.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/restore-identity/{version}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::restoreIdentity
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/restore-identity/{version}'
*/
restoreIdentity.url = (args: { slug: string | number, agent: string | number, version: string | number } | [slug: string | number, agent: string | number, version: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            agent: args[1],
            version: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        agent: args.agent,
        version: args.version,
    }

    return restoreIdentity.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::restoreIdentity
* @see app/Http/Controllers/AgentController.php:0
* @route '/workspaces/{slug}/agents/{agent}/restore-identity/{version}'
*/
restoreIdentity.post = (args: { slug: string | number, agent: string | number, version: string | number } | [slug: string | number, agent: string | number, version: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreIdentity.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:166
* @route '/workspaces/{slug}/agents/{agent}'
*/
export const destroy = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{slug}/agents/{agent}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:166
* @route '/workspaces/{slug}/agents/{agent}'
*/
destroy.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::destroy
* @see app/Http/Controllers/AgentController.php:166
* @route '/workspaces/{slug}/agents/{agent}'
*/
destroy.delete = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AgentController::update
* @see app/Http/Controllers/AgentController.php:125
* @route '/workspaces/{slug}/agents/{agent}'
*/
export const update = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/agents/{agent}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AgentController::update
* @see app/Http/Controllers/AgentController.php:125
* @route '/workspaces/{slug}/agents/{agent}'
*/
update.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::update
* @see app/Http/Controllers/AgentController.php:125
* @route '/workspaces/{slug}/agents/{agent}'
*/
update.put = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AgentController::show
* @see app/Http/Controllers/AgentController.php:65
* @route '/workspaces/{slug}/agents/{agent}'
*/
export const show = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/agents/{agent}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentController::show
* @see app/Http/Controllers/AgentController.php:65
* @route '/workspaces/{slug}/agents/{agent}'
*/
show.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::show
* @see app/Http/Controllers/AgentController.php:65
* @route '/workspaces/{slug}/agents/{agent}'
*/
show.get = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgentController::show
* @see app/Http/Controllers/AgentController.php:65
* @route '/workspaces/{slug}/agents/{agent}'
*/
show.head = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:309
* @route '/workspaces/{slug}/agents/{agent}/qr'
*/
export const qr = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(args, options),
    method: 'post',
})

qr.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/qr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:309
* @route '/workspaces/{slug}/agents/{agent}/qr'
*/
qr.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return qr.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::qr
* @see app/Http/Controllers/AgentController.php:309
* @route '/workspaces/{slug}/agents/{agent}/qr'
*/
qr.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: qr.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::disconnect
* @see app/Http/Controllers/AgentController.php:329
* @route '/workspaces/{slug}/agents/{agent}/disconnect'
*/
export const disconnect = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

disconnect.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/disconnect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::disconnect
* @see app/Http/Controllers/AgentController.php:329
* @route '/workspaces/{slug}/agents/{agent}/disconnect'
*/
disconnect.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return disconnect.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::disconnect
* @see app/Http/Controllers/AgentController.php:329
* @route '/workspaces/{slug}/agents/{agent}/disconnect'
*/
disconnect.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AgentController::restart
* @see app/Http/Controllers/AgentController.php:349
* @route '/workspaces/{slug}/agents/{agent}/restart'
*/
export const restart = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restart.url(args, options),
    method: 'put',
})

restart.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/agents/{agent}/restart',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AgentController::restart
* @see app/Http/Controllers/AgentController.php:349
* @route '/workspaces/{slug}/agents/{agent}/restart'
*/
restart.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return restart.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::restart
* @see app/Http/Controllers/AgentController.php:349
* @route '/workspaces/{slug}/agents/{agent}/restart'
*/
restart.put = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: restart.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AgentController::createInstance
* @see app/Http/Controllers/AgentController.php:369
* @route '/workspaces/{slug}/agents/{agent}/create-instance'
*/
export const createInstance = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createInstance.url(args, options),
    method: 'post',
})

createInstance.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/agents/{agent}/create-instance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentController::createInstance
* @see app/Http/Controllers/AgentController.php:369
* @route '/workspaces/{slug}/agents/{agent}/create-instance'
*/
createInstance.url = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions) => {
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

    return createInstance.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentController::createInstance
* @see app/Http/Controllers/AgentController.php:369
* @route '/workspaces/{slug}/agents/{agent}/create-instance'
*/
createInstance.post = (args: { slug: string | number, agent: string | number } | [slug: string | number, agent: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createInstance.url(args, options),
    method: 'post',
})

const agents = {
    knowledge: Object.assign(knowledge, knowledge),
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    promptHistory: Object.assign(promptHistory, promptHistory),
    linkInstance: Object.assign(linkInstance, linkInstance),
    unlinkInstance: Object.assign(unlinkInstance, unlinkInstance),
    clone: Object.assign(clone, clone),
    toggle: Object.assign(toggle, toggle),
    updateSettings: Object.assign(updateSettings, updateSettings),
    resetPrompt: Object.assign(resetPrompt, resetPrompt),
    restoreIdentity: Object.assign(restoreIdentity, restoreIdentity),
    destroy: Object.assign(destroy, destroy),
    update: Object.assign(update, update),
    show: Object.assign(show, show),
    test: Object.assign(test, test),
    qr: Object.assign(qr, qr),
    disconnect: Object.assign(disconnect, disconnect),
    restart: Object.assign(restart, restart),
    createInstance: Object.assign(createInstance, createInstance),
    document: Object.assign(document, document),
}

export default agents