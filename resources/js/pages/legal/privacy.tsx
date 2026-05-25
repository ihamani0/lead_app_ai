import { Head, Link, usePage } from '@inertiajs/react';

const sections = [
    { id: 'collect', title: '1. Information We Collect' },
    { id: 'use', title: '2. How We Use Your Information' },
    { id: 'sharing', title: '3. Data Sharing & Third Parties' },
    { id: 'security', title: '4. Data Security' },
    { id: 'retention', title: '5. Data Retention' },
    { id: 'rights', title: '6. Your Rights' },
    { id: 'cookies', title: '7. Cookies' },
    { id: 'third', title: '8. Third-Party Services' },
    { id: 'children', title: '9. Children&apos;s Privacy' },
    { id: 'changes', title: '10. Changes to Policy' },
    { id: 'contact', title: '11. Contact' },
];

export default function Privacy() {
    const supportEmail = usePage().props.support_email;

    return (
        <>
            <Head title="Privacy Policy" />

            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-[#6B6B80] transition-colors hover:text-[#4C3BCF]"
                    >
                        <svg
                            className="size-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to home
                    </Link>

                    <div className="mt-8">
                        <h1 className="text-[32px] font-bold text-[#0F0F10]">
                            Privacy Policy
                        </h1>
                        <p className="mt-2 text-sm text-[#6B6B80]">
                            Last updated: May 15, 2026
                        </p>
                        <p className="mt-1 text-xs text-[#6B6B80]">
                            Version 1.0
                        </p>
                    </div>

                    <div className="mt-8 rounded-lg border border-[#E2E2E7] bg-[#F7F7F8] p-6">
                        <h2 className="text-sm font-semibold text-[#0F0F10]">
                            Table of Contents
                        </h2>
                        <nav className="mt-3">
                            <ul className="space-y-2">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="text-sm text-[#4C3BCF] transition-colors hover:text-[#3B2EAD]"
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-[#0F0F10]">
                        <section id="collect">
                            <h2 className="text-xl font-bold">
                                1. Information We Collect
                            </h2>
                            <p className="mt-3">
                                We collect the following types of information
                                to provide and improve the Service:
                            </p>
                            <h3 className="mt-4 font-semibold">
                                Account Information
                            </h3>
                            <p className="mt-1">
                                When you register, we collect your name, email
                                address, and account credentials. If you sign
                                up via Google OAuth, we receive your name,
                                email, and Google ID from Google.
                            </p>
                            <h3 className="mt-4 font-semibold">
                                Usage Data
                            </h3>
                            <p className="mt-1">
                                We collect information about how you use the
                                Service, including your interactions,
                                preferences, and feature usage.
                            </p>
                            <h3 className="mt-4 font-semibold">
                                Communications Data
                            </h3>
                            <p className="mt-1">
                                The Service processes WhatsApp messages and
                                other communications you configure. This data
                                is stored and processed to provide the Service.
                            </p>
                            <h3 className="mt-4 font-semibold">
                                Payment Information
                            </h3>
                            <p className="mt-1">
                                {/* TODO: When Stripe/Paddle is integrated:
                                    - Update this section with payment processor details
                                    - Note that payment card details are handled by the processor
                                    - Add PCI compliance note
                                */}
                                If you subscribe to a paid plan, payment
                                processing is handled securely by our
                                third-party payment provider. We do not store
                                your full payment card details.
                            </p>
                        </section>

                        <section id="use">
                            <h2 className="text-xl font-bold">
                                2. How We Use Your Information
                            </h2>
                            <p className="mt-3">
                                We use your information to:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>Provide, maintain, and improve the Service.</li>
                                <li>
                                    Process your subscription and manage your
                                    account.
                                </li>
                                <li>
                                    Send you service-related communications
                                    (e.g., updates, security alerts).
                                </li>
                                <li>
                                    Respond to your support requests and
                                    inquiries.
                                </li>
                                <li>
                                    Analyze usage patterns to improve our
                                    features and user experience.
                                </li>
                                <li>
                                    Comply with legal obligations and enforce
                                    our Terms of Service.
                                </li>
                            </ul>
                        </section>

                        <section id="sharing">
                            <h2 className="text-xl font-bold">
                                3. Data Sharing & Third Parties
                            </h2>
                            <p className="mt-3">
                                We share your data only as necessary to provide
                                the Service:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    <strong>Resend</strong> &mdash; Transactional
                                    emails (verification, notifications).
                                </li>
                                <li>
                                    <strong>OpenAI / Anthropic</strong> &mdash; AI
                                    processing for chat and automation features.
                                </li>
                                <li>
                                    <strong>AWS (S3)</strong> &mdash; File and
                                    media storage.
                                </li>
                                <li>
                                    {/* TODO: When Stripe/Paddle is integrated:
                                        - Add Stripe/Paddle as a data recipient
                                        - Add purpose: payment processing
                                    */}
                                    <strong>Payment Processor</strong> &mdash;
                                    Payment processing for subscriptions
                                    (details to be added when integrated).
                                </li>
                            </ul>
                            <p className="mt-3">
                                We do not sell your personal information to
                                third parties. We may disclose information if
                                required by law or to protect our rights.
                            </p>
                        </section>

                        <section id="security">
                            <h2 className="text-xl font-bold">
                                4. Data Security
                            </h2>
                            <p className="mt-3">
                                We implement appropriate technical and
                                organizational measures to protect your data,
                                including:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    Encryption in transit (TLS) and at rest.
                                </li>
                                <li>
                                    Access controls and authentication
                                    requirements.
                                </li>
                                <li>
                                    Regular security audits and monitoring.
                                </li>
                            </ul>
                            <p className="mt-2">
                                While we strive to protect your data, no method
                                of transmission or storage is 100% secure.
                            </p>
                        </section>

                        <section id="retention">
                            <h2 className="text-xl font-bold">
                                5. Data Retention
                            </h2>
                            <p className="mt-3">
                                We retain your data for as long as your account
                                is active. When you delete your account, your
                                data is deleted within 30 days, except:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    {/* TODO: When Stripe/Paddle is integrated:
                                        - Add financial record retention period (typically 3-7 years)
                                    */}
                                    Financial records may be retained for the
                                    period required by applicable tax laws.
                                </li>
                                <li>
                                    Anonymized aggregate data may be retained
                                    for analytics.
                                </li>
                            </ul>
                        </section>

                        <section id="rights">
                            <h2 className="text-xl font-bold">
                                6. Your Rights
                            </h2>
                            <p className="mt-3">
                                Depending on your jurisdiction, you may have
                                the following rights:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    <strong>Access</strong> &mdash; Request a
                                    copy of your personal data.
                                </li>
                                <li>
                                    <strong>Correction</strong> &mdash; Update
                                    or correct inaccurate data.
                                </li>
                                <li>
                                    <strong>Deletion</strong> &mdash; Request
                                    deletion of your data.
                                </li>
                                <li>
                                    <strong>Portability</strong> &mdash; Export
                                    your data in a machine-readable format.
                                </li>
                                <li>
                                    <strong>Objection</strong> &mdash; Object
                                    to certain processing activities.
                                </li>
                            </ul>
                            <p className="mt-2">
                                To exercise these rights, contact us at{' '}
                                <span className="text-[#4C3BCF]">
                                    {/* TODO: Replace with your support email */}
                                    support@myia.app
                                </span>
                                .
                            </p>
                        </section>

                        <section id="cookies">
                            <h2 className="text-xl font-bold">7. Cookies</h2>
                            <p className="mt-3">
                                We use cookies and similar tracking
                                technologies to:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    Maintain your session and authentication
                                    state.
                                </li>
                                <li>
                                    Remember your preferences and settings.
                                </li>
                                <li>
                                    Analyze usage and improve the Service.
                                </li>
                            </ul>
                            <p className="mt-2">
                                You can control cookies through your browser
                                settings. Disabling cookies may affect certain
                                features of the Service.
                            </p>
                        </section>

                        <section id="third">
                            <h2 className="text-xl font-bold">
                                8. Third-Party Services
                            </h2>
                            <p className="mt-3">
                                The Service may contain links to third-party
                                websites or services. We are not responsible
                                for the privacy practices of these third
                                parties. We encourage you to review their
                                privacy policies.
                            </p>
                        </section>

                        <section id="children">
                            <h2 className="text-xl font-bold">
                                9. Children&apos;s Privacy
                            </h2>
                            <p className="mt-3">
                                The Service is not intended for individuals
                                under the age of 18. We do not knowingly
                                collect personal information from children. If
                                we become aware that a child has provided us
                                with personal data, we will delete it.
                            </p>
                        </section>

                        <section id="changes">
                            <h2 className="text-xl font-bold">
                                10. Changes to Policy
                            </h2>
                            <p className="mt-3">
                                We may update this Privacy Policy from time to
                                time. We will notify users of material changes
                                via email or through the Service.
                            </p>
                            <p className="mt-2">
                                Your continued use of the Service after changes
                                constitutes acceptance of the updated Policy.
                            </p>
                        </section>

                        <section id="contact">
                            <h2 className="text-xl font-bold">
                                11. Contact
                            </h2>
                            <p className="mt-3">
                                If you have any questions about this Privacy
                                Policy, please contact us at:
                            </p>
                            <p className="mt-2 text-[#4C3BCF]">
                                {/* TODO: Replace with your support email */}
                                <a href={`mailto:${supportEmail}`} className="font-semibold">
                                    {supportEmail}
                                </a>
                            </p>
                        </section>
                    </div>

                    <div className="mt-16 border-t border-[#E2E2E7] pt-8 text-center text-sm text-[#6B6B80]">
                        &copy; {new Date().getFullYear()} MyIA. All rights
                        reserved.
                    </div>
                </div>
            </div>
        </>
    );
}
