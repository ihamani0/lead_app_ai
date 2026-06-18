export interface Faq {
    id: number;
    question: string;
    answer: string | null;
    category: string | null;
    is_active: boolean;
    is_suggestion: boolean;
    usage_count: number;
    suggestion_data: {
        confidence: number;
        source_count: number;
    } | null;
    created_at: string;
    updated_at: string;
}

export interface Agent {
    id: string;
    name: string;
}

export interface FaqPaginated {
    data: Faq[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}
