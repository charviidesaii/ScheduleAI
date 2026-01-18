import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                                SchedMaster
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden sm:flex items-center space-x-8">
                        <Link
                            to="/rate"
                            state={{ fromNavbar: true }}
                            className={`text-sm font-medium transition-colors ${location.pathname === '/rate' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Rate Professors
                        </Link>
                        <Link
                            to="/courses"
                            state={{ fromNavbar: true }}
                            className={`text-sm font-medium transition-colors ${location.pathname === '/courses' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Select Courses
                        </Link>
                        <Link
                            to="/schedule"
                            state={{ fromNavbar: true }}
                            className={`text-sm font-medium transition-colors ${location.pathname === '/schedule' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            View Schedule
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
