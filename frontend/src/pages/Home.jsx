import React from "react";

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            {/* Header Section */}
            <header className="bg-blue-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome to Track My Expenses</h1>
                            <p className="text-lg">Take control of your finances with ease and precision.</p>
                        </div>
                        <a
                            href="/sign-up"
                            className="mt-4 md:mt-0 inline-block bg-white text-blue-600 py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-200"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="container mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-semibold mb-4">About Track My Expenses</h2>
                            <p className="text-lg leading-relaxed text-gray-700 mb-4">
                                Track My Expenses is your all-in-one solution for managing personal or business finances. Designed with simplicity and power, our app helps you monitor spending, set budgets, and gain insights into your financial habits. Whether you're saving for a big purchase, planning a vacation, or managing monthly bills, we provide the tools to succeed.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-700">
                                Our platform is ideal for individuals, families, and small business owners. With real-time updates and secure data handling, you can trust us to keep your finances organized and secure. Start your journey towards financial freedom today!
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://via.placeholder.com/400x300"
                                alt="Financial Dashboard"
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-left mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-md flex items-start gap-4">
                            <i className="fas fa-chart-line text-2xl text-blue-600"></i>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                                <p className="text-gray-600">
                                    Monitor your expenses as they happen with real-time updates. Stay informed about your financial status at any moment, ensuring you never overspend.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md flex items-start gap-4">
                            <i className="fas fa-wallet text-2xl text-blue-600"></i>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Custom Budgets</h3>
                                <p className="text-gray-600">
                                    Set personalized budgets for categories like groceries, utilities, and entertainment. Receive alerts when you're nearing your limits.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md flex items-start gap-4">
                            <i className="fas fa-file-alt text-2xl text-blue-600"></i>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
                                <p className="text-gray-600">
                                    Generate comprehensive reports to analyze spending patterns over time. Make informed decisions with clear, actionable insights.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md flex items-start gap-4">
                            <i className="fas fa-lock text-2xl text-blue-600"></i>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                                <p className="text-gray-600">
                                    Enjoy peace of mind with encrypted data and secure authentication, keeping your financial information safe and protected.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Content for Scrollability */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-left mb-6">Why Choose Us?</h2>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2">
                            <p className="text-lg leading-relaxed text-gray-700 mb-4">
                                At Track My Expenses, we prioritize your financial well-being. Our app is built with user feedback in mind, constantly evolving to meet your needs. With a focus on accessibility, our platform works seamlessly across devices, allowing you to manage your money anytime, anywhere.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-700">
                                Our team of financial experts and developers works tirelessly to ensure you have the best tools at your disposal. From intuitive design to powerful analytics, we’re here to support your financial journey every step of the way.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://via.placeholder.com/400x300"
                                alt="Financial Planning"
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-left mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Get Started Today</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Ready to take control of your finances? Sign up now to create your account and start tracking your expenses with Track My Expenses. It’s free to begin, and you’ll wonder how you ever managed without it! Join thousands of satisfied users who have transformed their financial lives.
                    </p>
                    <a
                        href="/sign-up"
                        className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Sign Up Now
                    </a>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-lg">&copy; 2025 Track My Expenses. All rights reserved.</p>
                        <p className="text-sm mt-2 md:mt-0">
                            Contact us at <a href="mailto:support@trackmyexpenses.com" className="text-blue-400 hover:underline">support@trackmyexpenses.com</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;