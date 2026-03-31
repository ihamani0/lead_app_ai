# AGENTS.md - Developer Guide for This Project

## Project Overview

Laravel 12 + React 19 (Inertia.js) SaaS application.

- **Backend**: PHP 8.2+, Laravel 12, SQLite for testing
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI
- **Testing**: PHPUnit (PHP)

---

## Build / Lint / Test Commands

### PHP (Laravel)

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `composer run test`  | Run lint + tests                                     |
| `composer run lint`  | Run Pint linter only                                 |
| `composer run dev`   | Full dev server (PHP + Vite + Queue + Reverb + Logs) |
| `composer run start` | Simple dev server (PHP + Vite)                       |

**Running a single PHP test:**

```bash
php artisan test tests/Feature/DashboardTest.php
php artisan test --filter=test_guests_are_redirected_to_the_login_page
```

### JavaScript/TypeScript

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `npm run build`  | Build frontend assets        |
| `npm run dev`    | Start Vite dev server        |
| `npm run lint`   | Run ESLint with auto-fix     |
| `npm run format` | Run Prettier with auto-fix   |
| `npm run types`  | Run TypeScript type checking |

---

## Code Style

### PHP

- **Formatter**: Laravel Pint (preset: `laravel`)
- **Run**: `composer run lint` or `pint`

### JavaScript/TypeScript

- **Formatter**: Prettier (tabWidth: 4, singleQuote, semi)
- **Linter**: ESLint with TypeScript support
- **Config**: `eslint.config.js`, `.prettierrc`, `tsconfig.json`

---

## Import Conventions

### TypeScript/React

Use explicit type imports:

```typescript
import type { FC } from 'react';
import type { Lead } from '@/types';
import { type ClassValue, clsx } from 'clsx';
```

Import order (enforced by ESLint):

1. Built-in (node) → 2. External (npm) → 3. Internal (`@/`) → 4. Relative

### PHP

Laravel convention with imports at top of file:

```php
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;
```

---

## TypeScript Guidelines

- **Strict mode**: Enabled in `tsconfig.json`
- **Type imports**: Always use `import type { ... }` for types
- **No implicit any**: Enabled
- **Path alias**: Use `@/` for `resources/js/`

---

## Naming Conventions

### TypeScript/React

- **Components**: PascalCase (`LeadCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLeadStore.ts`)
- **Utils**: camelCase (`leadHelper.ts`)
- **Types**: PascalCase (`Lead.ts`)

### PHP

- **Classes**: PascalCase (`LeadController`)
- **Methods**: camelCase (`index()`, `show()`)
- **Variables**: camelCase (`$lead`)
- **Database columns**: snake_case (`tenant_id`)

---

## Error Handling

### PHP/Laravel

```php
public function show(Request $request, $id)
{
    $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
    return Inertia::render('Leads/Show', ['lead' => $lead]);
}

try {
    $instance->save();
} catch (\Exception $e) {
    return back()->with('error', 'Failed to save instance.');
}
```

### React/TypeScript

```typescript
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
    try {
        await post('/api/leads', data);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
    }
};
```

---

## Component Patterns

### React Components

- Use functional components with `type FC<T>` for typed props
- Components: `resources/js/components/`
- Pages: `resources/js/pages/`
- UI primitives: `resources/js/components/ui/`

```typescript
import type { FC } from 'react';

interface LeadCardProps {
    lead: Lead;
    onEdit?: () => void;
}

export const LeadCard: FC<LeadCardProps> = ({ lead, onEdit }) => {
    return <Card>{lead.name}</Card>;
};
```

### Tailwind CSS

Use `cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<Button className={cn("base", isActive && "active")} />
```

---

## Testing Conventions

### PHP Tests (PHPUnit)

- Tests in `tests/Feature/` and `tests/Unit/`
- Use `RefreshDatabase` trait for database tests
- Naming: `TestNameTest.php`

```php
class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }
}
```

---

## Common Paths

| Path                       | Description         |
| -------------------------- | ------------------- |
| `resources/js/`            | Frontend source     |
| `resources/js/components/` | React components    |
| `resources/js/pages/`      | Inertia pages       |
| `app/Http/Controllers/`    | Laravel controllers |
| `app/Models/`              | Eloquent models     |
| `tests/`                   | PHPUnit tests       |
| `database/migrations/`     | Migrations          |

---

## Development Workflow

1. Start: `composer run dev` or `composer run start`
2. Make changes
3. Run linting: `composer run lint` + `npm run lint`
4. Run tests: `composer run test`
5. Build: `npm run build`

[logs] │ Instance issam-issam-A6Na updated to connected │
[logs] └────────────────────────────────── POST: /webhooks/evolution • Auth ID: guest ┘
[server] 2026-03-16 13:21:05 /webhooks/evolution ........................ ~ 500.68ms
[queue] 2026-03-16 12:21:07 App\Events\InstanceConnectionUpdated ........... RUNNING
[queue] 2026-03-16 12:21:07 App\Events\InstanceConnectionUpdated ..... 128.91ms DONE
[logs] ┌ 12:21:10 INFO ───────────────────────────────────────────────────────────────┐
[logs] │ Evolution Webhook: │
[logs] └ POST: /webhooks/evolution • Auth ID: guest • event: connection.update • instance: issam-issam-A6Na • data: array ( 'instance' => 'issam-issam-A6Na', 'state' => 'connecting', 'statusReason' => 200, ) • destination: http://172.18.0.1:8000/webhooks/evolution • date_time: 2026-03-16T09:10:35.194Z • server_url: http://localhost:8080 • apikey: NULL ┘
[logs] ┌ 12:21:10 INFO ───────────────────────────────────────────────────────────────┐
[logs] │ Instance issam-issam-A6Na updated to connecting │
[logs] └────────────────────────────────── POST: /webhooks/evolution • Auth ID: guest ┘
[server] 2026-03-16 13:21:10 /webhooks/evolution .............................. ~ 1s
[queue] 2026-03-16 12:21:12 App\Events\InstanceConnectionUpdated ........... RUNNING
[queue] 2026-03-16 12:21:12 App\Events\InstanceConnectionUpdated ...... 78.29ms DONE

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v2
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/reverb (REVERB) - v1
- laravel/sanctum (SANCTUM) - v4
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA_REACT) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/echo-react (ECHO_REACT) - v2
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- laravel-echo (ECHO) - v2
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `laravel-best-practices` — Apply this skill whenever writing, reviewing, or refactoring Laravel PHP code. This includes creating or modifying controllers, models, migrations, form requests, policies, jobs, scheduled commands, service classes, and Eloquent queries. Triggers for N+1 and query performance issues, caching strategies, authorization and security patterns, validation, error handling, queue and job configuration, route definitions, and architectural decisions. Also use for Laravel code reviews and refactoring existing Laravel code to follow best practices. Covers any task involving Laravel backend PHP code patterns.
- `wayfinder-development` — Activates whenever referencing backend routes in frontend components. Use when importing from @/actions or @/routes, calling Laravel routes from TypeScript, or working with Wayfinder route functions.
- `inertia-react-development` — Develops Inertia.js v2 React client-side applications. Activates when creating React pages, forms, or navigation; using <Link>, <Form>, useForm, or router; working with deferred props, prefetching, or polling; or when user mentions React with Inertia, React pages, React forms, or React navigation.
- `tailwindcss-development` — Always invoke when the user's message includes 'tailwind' in any form. Also invoke for: building responsive grid layouts (multi-column card grids, product grids), flex/grid page structures (dashboards with sidebars, fixed topbars, mobile-toggle navs), styling UI components (cards, tables, navbars, pricing sections, forms, inputs, badges), adding dark mode variants, fixing spacing or typography, and Tailwind v3/v4 work. The core use case: writing or fixing Tailwind utility classes in HTML templates (Blade, JSX, Vue). Skip for backend PHP logic, database queries, API routes, JavaScript with no HTML/CSS component, CSS file audits, build tool configuration, and vanilla CSS.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.
- To check environment variables, read the `.env` file directly.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v2

- Use all Inertia features from v1 and v2. Check the documentation before making changes to ensure the correct approach.
- New features: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v12 rules ===

# Laravel 12

- CRITICAL: ALWAYS use `search-docs` tool for version-specific Laravel documentation and updated code examples.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

## Laravel 12 Structure

- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app/Console/Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

## Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== wayfinder/core rules ===

# Laravel Wayfinder

Wayfinder generates TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

- IMPORTANT: Activate `wayfinder-development` skill whenever referencing backend routes in frontend components.
- Invokable Controllers: `import StorePost from '@/actions/.../StorePostController'; StorePost()`.
- Parameter Binding: Detects route keys (`{post:slug}`) — `show({ slug: "my-post" })`.
- Query Merging: `show(1, { mergeQuery: { page: 2, sort: null } })` merges with current URL, `null` removes params.
- Inertia: Use `.form()` with `<Form>` component or `form.submit(store())` with useForm.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== phpunit/core rules ===

# PHPUnit

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit {name}` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should cover all happy paths, failure paths, and edge cases.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files; these are core to the application.

## Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test --compact`.
- To run all tests in a file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=testName` (recommended after making a change to a related file).

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
