<?php 


namespace Ihamani0\LaravelEvolutionApi\Helpers;


class  N8NTrigger {

    /**
     * N8NTrigger
     *
     * A simple value object that represents the trigger configuration
     * for an N8N bot. Used in N8NService::create() and N8NService::update().
     *
     * Trigger types:   'all' | 'keyword'
     * Trigger operators: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex' | 'none'
     *
     * @package Ihamani0\LaravelEvolutionApi\Helpers
     */
    private function __construct(
        public readonly string $type     = 'all',
        public readonly string $operator = 'none',
        public readonly string $value    = '',
    )
    {}

    /**
     * Match all incoming messages without any keyword filter.
     *
     * @return static
    */
    public static function all(): static
    {
        return new static(type: 'all', operator: 'none', value: '');
    }


     /**
     * Trigger only when a message matches a keyword.
     *
     * @param string $value    The keyword or pattern to match against.
     * @param string $operator How to match: contains, equals, startsWith, endsWith, regex.
     *
     * @return static
     */
    public static function keyword(string $value, string $operator = 'equals'): static
    {
        return new static(type: 'keyword', operator: $operator, value: $value);
    }



    /**
     * Convert to array for use in API payload.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'triggerType'     => $this->type,
            'triggerOperator' => $this->operator,
            'triggerValue'    => $this->value,
        ];
    }





}