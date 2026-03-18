import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { DecorIcon } from '@/components/ui/decor-icon';
 

export function FaqsSection() {
    return (
        <section className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2 lg:border-x">
            <div className="px-4 pt-12 pb-6">
                <div className="space-y-5">
                    <h2 className="text-4xl font-bold text-balance md:text-6xl lg:font-black">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Quick answers to common questions about Efferd. Open any
                        question to learn more.
                    </p>
                    <p className="text-muted-foreground">
                        {"Can't find what you're looking for? "}
                        <a className="text-primary hover:underline" href="#">
                            Contact Us
                        </a>
                    </p>
                </div>
            </div>
            <div className="relative place-content-center">
                {/* vertical guide line */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
                />

                <Accordion
                    className="rounded-none border-x-0 border-y"
                    collapsible
                    type="single"
                >
                    {faqs.map((item) => (
                        <AccordionItem
                            className="group relative pl-5"
                            key={item.id}
                            value={item.id}
                        >
                            <DecorIcon
                                className="left-[13px] size-3 group-last:hidden"
                                position="bottom-left"
                            />

                            <AccordionTrigger className="px-4 py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
                                {item.title}
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4 text-muted-foreground">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
const faqs = [
    {
        id: 'item-1',
        title: 'What is Efferd?',
        content:
            'Efferd is an AI-powered WhatsApp automation platform that helps businesses handle customer conversations 24/7 with intelligent chatbots powered by n8n integration.',
    },
    {
        id: 'item-2',
        title: 'How does Efferd work?',
        content:
            'Connect your WhatsApp number, create AI agents with custom prompts, and automate conversations. Our platform integrates seamlessly with n8n for advanced workflows.',
    },
    {
        id: 'item-3',
        title: 'Do I need a WhatsApp Business account?',
        content:
            'Yes, you need a WhatsApp Business API account. We help you set it up through Evolution API - just connect and you\'re ready to go.',
    },
    {
        id: 'item-4',
        title: 'What is n8n and why do I need it?',
        content:
            'n8n is an automation tool that connects your WhatsApp to 200+ apps like CRM, email, and spreadsheets. Build custom workflows without writing code.',
    },
    {
        id: 'item-5',
        title: 'Is my data secure?',
        content:
            'Yes. All data is encrypted and stored in your tenant\'s isolated environment. We never access your WhatsApp conversations.',
    },
    {
        id: 'item-6',
        title: 'How many WhatsApp numbers can I manage?',
        content:
            'Unlimited. Each instance is an independent WhatsApp number with its own AI agent and automation rules.',
    },
    {
        id: 'item-7',
        title: 'Can I create different AI agents for different purposes?',
        content:
            'Yes! Each instance can have its own AI agent with custom prompts, automation rules, and n8n integrations tailored to your needs.',
    },
    {
        id: 'item-8',
        title: 'What happens when the AI can\'t handle a conversation?',
        content:
            'You can set fallback rules - conversations can be transferred to a human agent or you\'ll receive a notification to intervene.',
    },
    {
        id: 'item-9',
        title: 'Can I upload documents for the AI to use?',
        content:
            'Yes! Use the Knowledge Base feature to upload PDFs, documents, and files that your AI agent can reference during conversations.',
    },
    {
        id: 'item-10',
        title: 'How do I get started?',
        content:
            'Sign up, connect your first WhatsApp number, create your AI agent, and start automating. Our setup wizard guides you through the process.',
    },
];
