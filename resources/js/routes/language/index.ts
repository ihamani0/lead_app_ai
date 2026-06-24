import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\LanguageController::update
* @see app/Http/Controllers/Settings/LanguageController.php:12
* @route '/settings/language'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/language',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\LanguageController::update
* @see app/Http/Controllers/Settings/LanguageController.php:12
* @route '/settings/language'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LanguageController::update
* @see app/Http/Controllers/Settings/LanguageController.php:12
* @route '/settings/language'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

const language = {
    update: Object.assign(update, update),
}

export default language