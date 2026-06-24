import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::index
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:12
* @route '/super-admin/models'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/models',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::index
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:12
* @route '/super-admin/models'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::index
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:12
* @route '/super-admin/models'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::index
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:12
* @route '/super-admin/models'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::store
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:21
* @route '/super-admin/models'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/models',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::store
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:21
* @route '/super-admin/models'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::store
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:21
* @route '/super-admin/models'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::update
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:38
* @route '/super-admin/models/{llmModel}'
*/
export const update = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/super-admin/models/{llmModel}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::update
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:38
* @route '/super-admin/models/{llmModel}'
*/
update.url = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { llmModel: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { llmModel: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            llmModel: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        llmModel: typeof args.llmModel === 'object'
        ? args.llmModel.id
        : args.llmModel,
    }

    return update.definition.url
            .replace('{llmModel}', parsedArgs.llmModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::update
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:38
* @route '/super-admin/models/{llmModel}'
*/
update.post = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::destroy
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:55
* @route '/super-admin/models/{llmModel}'
*/
export const destroy = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/models/{llmModel}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::destroy
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:55
* @route '/super-admin/models/{llmModel}'
*/
destroy.url = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { llmModel: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { llmModel: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            llmModel: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        llmModel: typeof args.llmModel === 'object'
        ? args.llmModel.id
        : args.llmModel,
    }

    return destroy.definition.url
            .replace('{llmModel}', parsedArgs.llmModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\LlmModelController::destroy
* @see app/Http/Controllers/SuperAdmin/LlmModelController.php:55
* @route '/super-admin/models/{llmModel}'
*/
destroy.delete = (args: { llmModel: string | number | { id: string | number } } | [llmModel: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const model = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default model