import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, BookOpen, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight mb-8">
                        Build your perfect<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
                            college schedule.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                        Stop fighting with clunky portals. Rate your favorite professors, pick your courses, and let our AI assemble the perfect conflict-free schedule for you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/rate"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                        >
                            Start Building
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="mt-24 mb-12 text-center">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b-2 border-slate-100 pb-2">
                        How it Works
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Star className="text-amber-500" />,
                            title: "Rate Professors",
                            desc: "Input your preferences for teaching styles and difficulty."
                        },
                        {
                            icon: <BookOpen className="text-blue-500" />,
                            title: "Select Courses",
                            desc: "Choose the classes you need for your major requirements."
                        },
                        {
                            icon: <Calendar className="text-teal-500" />,
                            title: "Get Schedule",
                            desc: "Instantly generate optimized schedules that fit your life."
                        }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
