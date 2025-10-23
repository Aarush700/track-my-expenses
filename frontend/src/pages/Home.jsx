import React from "react";
import { TrendingUp, Wallet, FileText, Lock, ArrowRight, CheckCircle } from "lucide-react";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-900">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Take Control of Your
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Financial Future
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
                            Track expenses, set budgets, and gain insights into your spending habits with our powerful yet simple platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="/sign-up"
                                className="group bg-white text-black py-4 px-8 rounded-full hover:bg-gray-100 transition duration-300 font-semibold text-lg shadow-2xl flex items-center gap-2 transform hover:scale-105"
                            >
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#features"
                                className="text-white py-4 px-8 rounded-full border-2 border-white hover:bg-white hover:text-black transition duration-300 font-semibold text-lg"
                            >
                                Learn More
                            </a>
                        </div>
                        <div className="mt-12 flex justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Everyone</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your finances efficiently and effectively
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <TrendingUp className="w-10 h-10" />,
                                title: "Real-Time Tracking",
                                description: "Monitor your expenses as they happen with instant updates and live notifications."
                            },
                            {
                                icon: <Wallet className="w-10 h-10" />,
                                title: "Custom Budgets",
                                description: "Set personalized budgets and receive smart alerts when approaching limits."
                            },
                            {
                                icon: <FileText className="w-10 h-10" />,
                                title: "Detailed Reports",
                                description: "Generate comprehensive analytics and insights to understand your spending."
                            },
                            {
                                icon: <Lock className="w-10 h-10" />,
                                title: "Bank-Level Security",
                                description: "Your data is encrypted and protected with enterprise-grade security."
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Thousands Choose Us</h2>
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                We're not just another expense tracker. We're your financial partner, committed to helping you achieve your goals through intelligent insights and seamless experiences.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Intuitive interface designed for everyone",
                                    "Works seamlessly across all your devices",
                                    "Backed by financial experts and developers",
                                    "Constantly evolving with user feedback"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-lg text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl transform rotate-3"></div>
                                <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mt-6 flex items-center justify-center">
                                            <TrendingUp className="w-16 h-16 text-blue-600" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-6">
                                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Finances?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied users who have taken control of their financial future. Start your free trial today!
                    </p>
                    <a
                        href="/sign-up"
                        className="inline-block bg-white text-black py-4 px-10 rounded-full hover:bg-gray-100 transition duration-300 font-bold text-lg shadow-2xl transform hover:scale-105"
                    >
                        Sign Up Now - It's Free
                    </a>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-black text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <div className="text-2xl font-bold mb-2">Track My Expenses</div>
                            <p className="text-gray-400">&copy; 2025 All rights reserved.</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400 mb-2">Need help?</p>
                            <a href="mailto:support@trackmyexpenses.com" className="text-white hover:text-gray-300 transition">
                                aarushsingh3117@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;