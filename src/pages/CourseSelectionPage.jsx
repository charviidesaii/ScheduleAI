import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const CourseSelectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [allCourses, setAllCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [userReview, setUserReview] = useState(null);

    useEffect(() => {
        // Fetch courses from backend
        fetch('http://localhost:3001/api/courses')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setAllCourses(data.data);
                    localStorage.setItem('allCourses', JSON.stringify(data.data));

                    // Filter out "ghost" courses (IDs persisting in storage but removed from backend)
                    // This handles cases like HIST102 being removed or server restarts wiping dynamic courses
                    setSelectedCourses(prev => {
                        const validIds = new Set(data.data.map(c => c.id));
                        const filtered = prev.filter(id => validIds.has(id));

                        // If we filtered anything out, update localStorage immediately
                        if (filtered.length !== prev.length) {
                            console.log("Removed ghost courses:", prev.filter(id => !validIds.has(id)));
                            localStorage.setItem('selectedCourseIds', JSON.stringify(filtered));
                        }
                        return filtered;
                    });

                    // Handle pre-selection from previous step
                    if (location.state?.newCourse) {
                        const newCourseId = location.state.newCourse.id;
                        setSelectedCourses(prev => {
                            // Avoid duplicates if valid
                            if (prev.includes(newCourseId)) return prev;
                            return [...prev, newCourseId];
                        });
                    }
                }
            })
            .catch(err => console.error("Error fetching courses:", err));

        if (location.state?.submittedReview) {
            setUserReview(location.state.submittedReview);
        }
    }, [location.state]);

    // Load selection from localStorage on mount
    useEffect(() => {
        const savedSelection = localStorage.getItem('selectedCourseIds');
        if (savedSelection) {
            setSelectedCourses(JSON.parse(savedSelection));
        }
    }, []);

    const toggleCourse = (id) => {
        setSelectedCourses(prev => {
            const newState = prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id];

            // Save to localStorage
            localStorage.setItem('selectedCourseIds', JSON.stringify(newState));
            return newState;
        });
    };

    const handleGenerate = () => {
        if (selectedCourses.length > 0) {
            navigate('/schedule', {
                state: {
                    selectedCourseIds: selectedCourses,
                    allCourses: allCourses,
                    userReview: userReview
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">


            {!location.state?.fromNavbar && <StepIndicator currentStep={2} />}

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">Select Your Courses</h2>
                            <p className="mt-2 text-slate-600">Choose the classes you want to take this semester.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-8">
                            {allCourses.map((course) => {
                                const isSelected = selectedCourses.includes(course.id);
                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => toggleCourse(course.id)}
                                        className={`
                      relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                      ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                                            }
                    `}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-mono text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                                                    {course.id}
                                                </span>
                                                <h3 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                                                    {course.name}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 ml-0.5">{course.credits} Credits</p>
                                        </div>

                                        <div className={`
                      flex items-center justify-center h-6 w-6 rounded-md border-2 transition-colors
                      ${isSelected
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'border-slate-300 bg-white'
                                            }
                    `}>
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 gap-4">
                            <p className="text-sm text-slate-500 order-2 sm:order-1">
                                {selectedCourses.length} courses selected
                            </p>
                            <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                                <button
                                    onClick={() => navigate('/rate')}
                                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={selectedCourses.length === 0}
                                    className={`
                    flex-1 sm:flex-none inline-flex justify-center items-center gap-2 py-3 px-8 rounded-xl font-semibold text-white shadow-lg transition-all duration-300
                    ${selectedCourses.length === 0
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
                                        }
                  `}
                                >
                                    Generate Schedule
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseSelectionPage;
