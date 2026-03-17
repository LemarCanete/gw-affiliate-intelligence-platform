export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ArrowLeft, Radar } from 'lucide-react';

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;
    const testimonials = [
        {
            quote: "We discovered a gap window in the AI tutoring niche 36 hours before any competitor moved. That single product drove $4,200 in commissions last month.",
            author: "James Hartley",
            role: "Affiliate Strategist",
            avatar: "JH"
        },
        {
            quote: "The scoring engine is ruthless in the best way. It killed 80% of the products I would have wasted time on and surfaced the 20% that actually convert.",
            author: "Priya Nair",
            role: "Content Creator, EduStack",
            avatar: "PN"
        },
        {
            quote: "GEO citation tracking alone is worth the subscription. We now know exactly which AI engines reference our reviews and can optimise for each one.",
            author: "Marcus Chen",
            role: "SEO Director, RevFlow",
            avatar: "MC"
        }
    ];

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white relative">
                <Link
                    href="/"
                    className="absolute left-8 top-8 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Homepage
                </Link>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <Radar className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            {productName}
                        </h2>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
                <div className="w-full flex items-center justify-center p-12">
                    <div className="space-y-6 max-w-lg">
                        <h3 className="text-white text-2xl font-bold mb-8">
                            Trusted by affiliate marketers worldwide
                        </h3>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary-400/20 flex items-center justify-center text-white font-semibold text-sm">
                                            {testimonial.avatar}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/90 mb-2 font-light leading-relaxed">
                                            &#34;{testimonial.quote}&#34;
                                        </p>
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-white">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-sm text-primary-300">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-8 text-center">
                            <p className="text-primary-200 text-sm">
                                8 feeds. AI scoring. Revenue attribution. All in one platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
