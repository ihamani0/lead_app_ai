import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AccountSettingsController::settings
* @see app/Http/Controllers/Settings/AccountSettingsController.php:17
* @route '/account/settings'
*/
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/account/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AccountSettingsController::settings
* @see app/Http/Controllers/Settings/AccountSettingsController.php:17
* @route '/account/settings'
*/
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AccountSettingsController::settings
* @see app/Http/Controllers/Settings/AccountSettingsController.php:17
* @route '/account/settings'
*/
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AccountSettingsController::settings
* @see app/Http/Controllers/Settings/AccountSettingsController.php:17
* @route '/account/settings'
*/
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\BillingController::billing
* @see app/Http/Controllers/Settings/BillingController.php:15
* @route '/account/billing'
*/
export const billing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})

billing.definition = {
    methods: ["get","head"],
    url: '/account/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\BillingController::billing
* @see app/Http/Controllers/Settings/BillingController.php:15
* @route '/account/billing'
*/
billing.url = (options?: RouteQueryOptions) => {
    return billing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\BillingController::billing
* @see app/Http/Controllers/Settings/BillingController.php:15
* @route '/account/billing'
*/
billing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\BillingController::billing
* @see app/Http/Controllers/Settings/BillingController.php:15
* @route '/account/billing'
*/
billing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: billing.url(options),
    method: 'head',
})

const account = {
    settings: Object.assign(settings, settings),
    billing: Object.assign(billing, billing),
}

export default account