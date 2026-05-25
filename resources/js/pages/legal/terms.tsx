import { Head, Link, usePage } from '@inertiajs/react';

const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'service', title: '2. Description of Service' },
    { id: 'accounts', title: '3. User Accounts & Registration' },
    { id: 'subscriptions', title: '4. Subscriptions & Payments' },
    { id: 'use', title: '5. Acceptable Use' },
    { id: 'ip', title: '6. Intellectual Property' },
    { id: 'liability', title: '7. Limitation of Liability' },
    { id: 'termination', title: '8. Termination & Suspension' },
    { id: 'law', title: '9. Governing Law' },
    { id: 'changes', title: '10. Changes to Terms' },
    { id: 'contact', title: '11. Contact' },
];

export default function Terms() {
        const supportEmail = usePage().props.support_email;
    
    return (
        <>
            <Head title="Terms of Service" />

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
                            Terms of Service
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
                        <section id="acceptance">
                            <h2 className="text-xl font-bold">
                                1. Acceptance of Terms
                            </h2>
                            <p className="mt-3">
                                By accessing or using MyIA (&ldquo;the
                                Service&rdquo;), you agree to be bound by these
                                Terms of Service (&ldquo;Terms&rdquo;). If you
                                do not agree, you may not use the Service.
                            </p>
                            <p className="mt-2">
                                These Terms apply to all users, including
                                visitors, registered users, and paid
                                subscribers.
                            </p>
                        </section>

                        <section id="service">
                            <h2 className="text-xl font-bold">
                                2. Description of Service
                            </h2>
                            <p className="mt-3">
                                MyIA provides an AI-powered workspace that
                                includes WhatsApp automation, lead management,
                                knowledge bases, analytics, and related tools
                                (&ldquo;the Service&rdquo;).
                            </p>
                            <p className="mt-2">
                                We reserve the right to modify, suspend, or
                                discontinue any aspect of the Service at any
                                time with reasonable notice.
                            </p>
                        </section>

                        <section id="accounts">
                            <h2 className="text-xl font-bold">
                                3. User Accounts & Registration
                            </h2>
                            <p className="mt-3">
                                You are responsible for maintaining the
                                confidentiality of your account credentials and
                                for all activities under your account.
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    You must provide accurate and complete
                                    information during registration.
                                </li>
                                <li>
                                    You must be at least 18 years old to use
                                    the Service.
                                </li>
                                <li>
                                    Each user may only maintain one account
                                    unless otherwise authorized in writing.
                                </li>
                                <li>
                                    You must notify us immediately of any
                                    unauthorized use of your account.
                                </li>
                            </ul>
                        </section>

                        <section id="subscriptions">
                            <h2 className="text-xl font-bold">
                                4. Subscriptions & Payments
                            </h2>
                            <p className="mt-3">
                                Certain features of the Service require a paid
                                subscription. By subscribing, you agree to the
                                following:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    Subscription fees are billed in advance on
                                    a monthly or annual basis as selected.
                                </li>
                                <li>
                                    All fees are non-refundable except as
                                    expressly stated in our refund policy.
                                </li>
                                <li>
                                    We reserve the right to change our pricing
                                    with 30 days&apos; notice.
                                </li>
                                <li>
                                    {/* TODO: When Stripe/Paddle is integrated:
                                        - Add payment processor details
                                        - Add automatic renewal terms
                                        - Add dunning/retry logic
                                        - Add tax/VAT handling
                                    */}
                                    Payments are processed securely by our
                                    third-party payment provider. Your payment
                                    details are not stored by MyIA.
                                </li>
                            </ul>
                        </section>

                        <section id="use">
                            <h2 className="text-xl font-bold">
                                5. Acceptable Use
                            </h2>
                            <p className="mt-3">
                                You agree not to use the Service for any
                                unlawful purpose or in violation of these
                                Terms. Prohibited activities include:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>
                                    Sending spam, unsolicited messages, or
                                    abusive content via the platform.
                                </li>
                                <li>
                                    Reverse engineering, decompiling, or
                                    attempting to extract the source code.
                                </li>
                                <li>
                                    Using the Service to violate any applicable
                                    laws or regulations.
                                </li>
                                <li>
                                    Interfering with the security or
                                    performance of the Service.
                                </li>
                                <li>
                                    Reselling or redistributing the Service
                                    without our written consent.
                                </li>
                            </ul>
                        </section>

                        <section id="ip">
                            <h2 className="text-xl font-bold">
                                6. Intellectual Property
                            </h2>
                            <p className="mt-3">
                                The Service, including its code, design,
                                branding, and content (excluding user-provided
                                data), is owned by MyIA and protected by
                                intellectual property laws.
                            </p>
                            <p className="mt-2">
                                You retain all rights to the data, messages,
                                and content you submit to the Service. By using
                                the Service, you grant us a limited license to
                                process this data solely to provide the Service
                                to you.
                            </p>
                        </section>

                        <section id="liability">
                            <h2 className="text-xl font-bold">
                                7. Limitation of Liability
                            </h2>
                            <p className="mt-3">
                                The Service is provided &ldquo;as is&rdquo;
                                without warranties of any kind, either express
                                or implied.
                            </p>
                            <p className="mt-2">
                                To the maximum extent permitted by law, MyIA
                                shall not be liable for any indirect,
                                incidental, special, or consequential damages
                                arising from your use of the Service.
                            </p>
                            <p className="mt-2">
                                Our total liability shall not exceed the amount
                                you have paid us in the 12 months preceding the
                                claim.
                            </p>
                        </section>

                        <section id="termination">
                            <h2 className="text-xl font-bold">
                                8. Termination & Suspension
                            </h2>
                            <p className="mt-3">
                                We may suspend or terminate your access to the
                                Service at any time for violation of these
                                Terms.
                            </p>
                            <p className="mt-2">
                                You may cancel your account at any time from
                                your settings. Upon termination, your data will
                                be deleted in accordance with our Privacy
                                Policy.
                            </p>
                        </section>

                        <section id="law">
                            <h2 className="text-xl font-bold">
                                9. Governing Law
                            </h2>
                            <p className="mt-3">
                                These Terms shall be governed by and construed
                                in accordance with the laws of{' '}
                                {/* TODO: Specify your jurisdiction */}
                                the applicable jurisdiction, without regard to
                                its conflict of law provisions.
                            </p>
                            <p className="mt-2">
                                Any disputes arising from these Terms shall be
                                resolved through binding arbitration in
                                accordance with the rules of the{' '}
                                {/* TODO: Specify arbitration body */}
                                applicable arbitration institution.
                            </p>
                        </section>

                        <section id="changes">
                            <h2 className="text-xl font-bold">
                                10. Changes to Terms
                            </h2>
                            <p className="mt-3">
                                We may update these Terms from time to time. We
                                will notify users of material changes via email
                                or through the Service.
                            </p>
                            <p className="mt-2">
                                Continued use of the Service after changes
                                constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <section id="contact">
                            <h2 className="text-xl font-bold">
                                11. Contact
                            </h2>
                            <p className="mt-3">
                                If you have any questions about these Terms,
                                please contact us at:
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
