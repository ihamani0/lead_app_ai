import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import credit from './credit'
/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:16
* @route '/billing/checkout/{plan}'
*/
export const checkout = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/checkout/{plan}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:16
* @route '/billing/checkout/{plan}'
*/
checkout.url = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { plan: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            plan: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return checkout.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:16
* @route '/billing/checkout/{plan}'
*/
checkout.post = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\InvoiceController::invoice
* @see app/Http/Controllers/Settings/InvoiceController.php:11
* @route '/billing/transactions/{transaction}/invoice'
*/
export const invoice = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/billing/transactions/{transaction}/invoice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\InvoiceController::invoice
* @see app/Http/Controllers/Settings/InvoiceController.php:11
* @route '/billing/transactions/{transaction}/invoice'
*/
invoice.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return invoice.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\InvoiceController::invoice
* @see app/Http/Controllers/Settings/InvoiceController.php:11
* @route '/billing/transactions/{transaction}/invoice'
*/
invoice.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\InvoiceController::invoice
* @see app/Http/Controllers/Settings/InvoiceController.php:11
* @route '/billing/transactions/{transaction}/invoice'
*/
invoice.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\CheckoutController::portal
* @see app/Http/Controllers/Settings/CheckoutController.php:47
* @route '/billing/portal'
*/
export const portal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: portal.url(options),
    method: 'post',
})

portal.definition = {
    methods: ["post"],
    url: '/billing/portal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CheckoutController::portal
* @see app/Http/Controllers/Settings/CheckoutController.php:47
* @route '/billing/portal'
*/
portal.url = (options?: RouteQueryOptions) => {
    return portal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CheckoutController::portal
* @see app/Http/Controllers/Settings/CheckoutController.php:47
* @route '/billing/portal'
*/
portal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: portal.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\CheckoutController::cancel
* @see app/Http/Controllers/Settings/CheckoutController.php:63
* @route '/billing/subscription/cancel'
*/
export const cancel = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/billing/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CheckoutController::cancel
* @see app/Http/Controllers/Settings/CheckoutController.php:63
* @route '/billing/subscription/cancel'
*/
cancel.url = (options?: RouteQueryOptions) => {
    return cancel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CheckoutController::cancel
* @see app/Http/Controllers/Settings/CheckoutController.php:63
* @route '/billing/subscription/cancel'
*/
cancel.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

const billing = {
    checkout: Object.assign(checkout, checkout),
    invoice: Object.assign(invoice, invoice),
    portal: Object.assign(portal, portal),
    cancel: Object.assign(cancel, cancel),
    credit: Object.assign(credit, credit),
}

export default billing