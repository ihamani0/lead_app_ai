import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import sessionB29d8e from './session'
/**
* @see \App\Http\Controllers\LeadController::index
* @see app/Http/Controllers/LeadController.php:17
* @route '/workspaces/{slug}/leads'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeadController::index
* @see app/Http/Controllers/LeadController.php:17
* @route '/workspaces/{slug}/leads'
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
* @see \App\Http\Controllers\LeadController::index
* @see app/Http/Controllers/LeadController.php:17
* @route '/workspaces/{slug}/leads'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeadController::index
* @see app/Http/Controllers/LeadController.php:17
* @route '/workspaces/{slug}/leads'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeadController::exportMethod
* @see app/Http/Controllers/LeadController.php:102
* @route '/workspaces/{slug}/leads/export'
*/
export const exportMethod = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeadController::exportMethod
* @see app/Http/Controllers/LeadController.php:102
* @route '/workspaces/{slug}/leads/export'
*/
exportMethod.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::exportMethod
* @see app/Http/Controllers/LeadController.php:102
* @route '/workspaces/{slug}/leads/export'
*/
exportMethod.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeadController::exportMethod
* @see app/Http/Controllers/LeadController.php:102
* @route '/workspaces/{slug}/leads/export'
*/
exportMethod.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeadController::profile
* @see app/Http/Controllers/LeadController.php:262
* @route '/workspaces/{slug}/leads/{lead}/profile'
*/
export const profile = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(args, options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/{lead}/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeadController::profile
* @see app/Http/Controllers/LeadController.php:262
* @route '/workspaces/{slug}/leads/{lead}/profile'
*/
profile.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return profile.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::profile
* @see app/Http/Controllers/LeadController.php:262
* @route '/workspaces/{slug}/leads/{lead}/profile'
*/
profile.get = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeadController::profile
* @see app/Http/Controllers/LeadController.php:262
* @route '/workspaces/{slug}/leads/{lead}/profile'
*/
profile.head = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeadController::block
* @see app/Http/Controllers/LeadController.php:306
* @route '/workspaces/{slug}/leads/{lead}/block'
*/
export const block = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(args, options),
    method: 'post',
})

block.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/leads/{lead}/block',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeadController::block
* @see app/Http/Controllers/LeadController.php:306
* @route '/workspaces/{slug}/leads/{lead}/block'
*/
block.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return block.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::block
* @see app/Http/Controllers/LeadController.php:306
* @route '/workspaces/{slug}/leads/{lead}/block'
*/
block.post = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeadController::show
* @see app/Http/Controllers/LeadController.php:66
* @route '/workspaces/{slug}/leads/{lead}'
*/
export const show = (args: { slug: string | number, lead: string | number } | [slug: string | number, lead: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/{lead}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeadController::show
* @see app/Http/Controllers/LeadController.php:66
* @route '/workspaces/{slug}/leads/{lead}'
*/
show.url = (args: { slug: string | number, lead: string | number } | [slug: string | number, lead: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: args.lead,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::show
* @see app/Http/Controllers/LeadController.php:66
* @route '/workspaces/{slug}/leads/{lead}'
*/
show.get = (args: { slug: string | number, lead: string | number } | [slug: string | number, lead: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeadController::show
* @see app/Http/Controllers/LeadController.php:66
* @route '/workspaces/{slug}/leads/{lead}'
*/
show.head = (args: { slug: string | number, lead: string | number } | [slug: string | number, lead: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeadController::update
* @see app/Http/Controllers/LeadController.php:161
* @route '/workspaces/{slug}/leads/{id}'
*/
export const update = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/workspaces/{slug}/leads/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\LeadController::update
* @see app/Http/Controllers/LeadController.php:161
* @route '/workspaces/{slug}/leads/{id}'
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
* @see \App\Http\Controllers\LeadController::update
* @see app/Http/Controllers/LeadController.php:161
* @route '/workspaces/{slug}/leads/{id}'
*/
update.put = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LeadController::triggerQualification
* @see app/Http/Controllers/LeadController.php:190
* @route '/workspaces/{slug}/leads/{id}/trigger-qualification'
*/
export const triggerQualification = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: triggerQualification.url(args, options),
    method: 'post',
})

triggerQualification.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/leads/{id}/trigger-qualification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeadController::triggerQualification
* @see app/Http/Controllers/LeadController.php:190
* @route '/workspaces/{slug}/leads/{id}/trigger-qualification'
*/
triggerQualification.url = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions) => {
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

    return triggerQualification.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::triggerQualification
* @see app/Http/Controllers/LeadController.php:190
* @route '/workspaces/{slug}/leads/{id}/trigger-qualification'
*/
triggerQualification.post = (args: { slug: string | number, id: string | number } | [slug: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: triggerQualification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeadController::bulkQualify
* @see app/Http/Controllers/LeadController.php:211
* @route '/workspaces/{slug}/leads/bulk-qualify'
*/
export const bulkQualify = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQualify.url(args, options),
    method: 'post',
})

bulkQualify.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/leads/bulk-qualify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeadController::bulkQualify
* @see app/Http/Controllers/LeadController.php:211
* @route '/workspaces/{slug}/leads/bulk-qualify'
*/
bulkQualify.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return bulkQualify.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadController::bulkQualify
* @see app/Http/Controllers/LeadController.php:211
* @route '/workspaces/{slug}/leads/bulk-qualify'
*/
bulkQualify.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQualify.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeadMessageController::messages
* @see app/Http/Controllers/LeadMessageController.php:14
* @route '/workspaces/{slug}/leads/{lead}/messages'
*/
export const messages = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/{lead}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeadMessageController::messages
* @see app/Http/Controllers/LeadMessageController.php:14
* @route '/workspaces/{slug}/leads/{lead}/messages'
*/
messages.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return messages.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadMessageController::messages
* @see app/Http/Controllers/LeadMessageController.php:14
* @route '/workspaces/{slug}/leads/{lead}/messages'
*/
messages.get = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeadMessageController::messages
* @see app/Http/Controllers/LeadMessageController.php:14
* @route '/workspaces/{slug}/leads/{lead}/messages'
*/
messages.head = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeadMessageController::send
* @see app/Http/Controllers/LeadMessageController.php:25
* @route '/workspaces/{slug}/leads/{lead}/send'
*/
export const send = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/leads/{lead}/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeadMessageController::send
* @see app/Http/Controllers/LeadMessageController.php:25
* @route '/workspaces/{slug}/leads/{lead}/send'
*/
send.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return send.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeadMessageController::send
* @see app/Http/Controllers/LeadMessageController.php:25
* @route '/workspaces/{slug}/leads/{lead}/send'
*/
send.post = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SessionController::session
* @see app/Http/Controllers/SessionController.php:35
* @route '/workspaces/{slug}/leads/{lead}/session'
*/
export const session = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/{lead}/session',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SessionController::session
* @see app/Http/Controllers/SessionController.php:35
* @route '/workspaces/{slug}/leads/{lead}/session'
*/
session.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return session.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionController::session
* @see app/Http/Controllers/SessionController.php:35
* @route '/workspaces/{slug}/leads/{lead}/session'
*/
session.get = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SessionController::session
* @see app/Http/Controllers/SessionController.php:35
* @route '/workspaces/{slug}/leads/{lead}/session'
*/
session.head = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SessionController::sessions
* @see app/Http/Controllers/SessionController.php:52
* @route '/workspaces/{slug}/leads/{lead}/sessions'
*/
export const sessions = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessions.url(args, options),
    method: 'get',
})

sessions.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/leads/{lead}/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SessionController::sessions
* @see app/Http/Controllers/SessionController.php:52
* @route '/workspaces/{slug}/leads/{lead}/sessions'
*/
sessions.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return sessions.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionController::sessions
* @see app/Http/Controllers/SessionController.php:52
* @route '/workspaces/{slug}/leads/{lead}/sessions'
*/
sessions.get = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessions.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SessionController::sessions
* @see app/Http/Controllers/SessionController.php:52
* @route '/workspaces/{slug}/leads/{lead}/sessions'
*/
sessions.head = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessions.url(args, options),
    method: 'head',
})

const leads = {
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
    profile: Object.assign(profile, profile),
    block: Object.assign(block, block),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    triggerQualification: Object.assign(triggerQualification, triggerQualification),
    bulkQualify: Object.assign(bulkQualify, bulkQualify),
    messages: Object.assign(messages, messages),
    send: Object.assign(send, send),
    session: Object.assign(session, sessionB29d8e),
    sessions: Object.assign(sessions, sessions),
}

export default leads