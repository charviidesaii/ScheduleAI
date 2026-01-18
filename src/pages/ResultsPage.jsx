
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { Clock, User, CalendarCheck, ArrowLeft, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

const mockScheduleDatabase = [
    {
        code: 'CS101',
        name: 'Intro to CS',
        prof: 'Dr. Sarah Miller',
        time: 'Mon/Wed 10:00 AM - 11:30 AM',
        rating: 4.8,
        reviews: []
    },
    {
        code: 'MATH201',
        name: 'Calculus II',
        prof: 'Prof. James Chen',
        time: 'Tue/Thu 1:00 PM - 2:30 PM',
        rating: 4.6,
        reviews: []
    },
    {
        code: 'PHYS101',
        name: 'Gen Physics I',
        prof: 'Dr. Emily Johnson',
        time: 'Mon/Wed 2:00 PM - 3:30 PM',
        rating: 4.9,
        reviews: []
    },
    {
        code: 'ART101',
        name: 'Art History',
        prof: 'Staff',
        time: 'Fri 10:00 AM - 1:00 PM',
        rating: 4.2,
        reviews: []
    },
];

const ResultsPage = () => {
    const location = useLocation();
    const [expandedRow, setExpandedRow] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [dbReviews, setDbReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/reviews')
            .then(res => res.json())
            .then(data => {
                if (data.data) setDbReviews(data.data);
            })
            .catch(err => console.error("Error fetching reviews:", err));
    }, []);

    useEffect(() => {
        const stateSelectedIds = location.state?.selectedCourseIds;
        const storageSelectedIds = localStorage.getItem('selectedCourseIds') ? JSON.parse(localStorage.getItem('selectedCourseIds')) : [];

        const selectedCourseIds = stateSelectedIds || storageSelectedIds;

        const stateAllCourses = location.state?.allCourses;
        const storageAllCourses = localStorage.getItem('allCourses') ? JSON.parse(localStorage.getItem('allCourses')) : [];

        const allCourses = stateAllCourses || storageAllCourses;

        if (selectedCourseIds && selectedCourseIds.length > 0) {

            const newSchedule = selectedCourseIds.map(courseId => {
                // Determine Professor Name to link 'General' reviews
                let profName = null;
                const existingMock = mockScheduleDatabase.find(c => c.code === courseId);
                if (existingMock) {
                    profName = existingMock.prof;
                } else {
                    // Try to find the 'creation' review for this dynamic course
                    const creationReview = dbReviews.find(r => r.course_id === courseId);
                    if (creationReview) profName = creationReview.professor_name;
                }

                // Find matching reviews from DB with robust ID matching
                const relevantReviews = dbReviews.filter(r =>
                    (r.course_id && r.course_id.trim() === courseId.trim()) ||
                    (profName && r.professor_name === profName)
                ).map(r => ({
                    user: r.user_name,
                    comment: r.comment,
                    rating: r.rating,
                    professor_name: r.professor_name,
                    course_id: r.course_id
                }));

                // Determine professor name for the schedule card
                // Prioritize the professor name from the review if available (e.g. Snape for Potions)
                const dynamicProfName = relevantReviews.find(r => r.course_id && r.course_id.trim() === courseId.trim())?.professor_name;

                // Try to find in mock DB
                const existing = mockScheduleDatabase.find(c => c.code === courseId);

                if (existing) {
                    // Merge DB reviews with existing mock reviews
                    const allReviews = [...relevantReviews, ...existing.reviews];

                    // Calculate weighted rating (giving historical rating a weight equivalent to 10 reviews)
                    const historicalWeight = 10;
                    const newRatingSum = relevantReviews.reduce((acc, r) => acc + r.rating, 0);
                    const weightedRating = ((existing.rating * historicalWeight) + newRatingSum) / (historicalWeight + relevantReviews.length);

                    return {
                        ...existing,
                        rating: Number(weightedRating.toFixed(1)),
                        reviews: allReviews
                    };
                } else {
                    // It's a new dynamic course
                    const courseInfo = allCourses?.find(c => c.id === courseId);
                    // Find if we have any info from the review (prof name etc)
                    // We might need to fetch prof name if not in allCourses, but allCourses usually has name.
                    // If it was added via "Add Prof", the review might have the prof name.
                    // const relevantReview = dbReviews.find(r => r.course_id === courseId); // Removed as we use relevantReviews now

                    const avgRating = relevantReviews.length > 0
                        ? (relevantReviews.reduce((acc, r) => acc + r.rating, 0) / relevantReviews.length)
                        : 0;
                    const formatTo12Hour = (time) => {
                        if (!time) return '';
                        // Check if already has am/pm
                        if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) return time;

                        const [hours, minutes] = time.split(':');
                        if (!minutes) return time; // Not a valid HH:MM string

                        let h = parseInt(hours, 10);
                        const m = minutes;
                        const ampm = h >= 12 ? 'PM' : 'AM';

                        h = h % 12;
                        h = h ? h : 12; // the hour '0' should be '12'
                        return `${h}:${m} ${ampm}`;
                    };

                    const timeString = (courseInfo?.days && courseInfo?.start_time && courseInfo?.end_time)
                        ? `${courseInfo.days} ${formatTo12Hour(courseInfo.start_time)} - ${formatTo12Hour(courseInfo.end_time)}`
                        : 'TBD';

                    return {
                        code: courseId,
                        name: courseInfo?.name || 'Custom Course',
                        prof: dynamicProfName || relevantReviews[0]?.professor_name || 'Staff',
                        time: timeString,
                        rating: Number(avgRating.toFixed(1)),
                        reason: 'User selected course.',
                        reviews: relevantReviews
                    };
                }
            });
            setSchedule(newSchedule);
        }
    }, [location.state, dbReviews]);

    const toggleRow = (idx) => {
        setExpandedRow(expandedRow === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">


            {!location.state?.fromNavbar && <StepIndicator currentStep={3} />}

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 sm:p-10">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your Schedule</h2>
                                </div>
                                <p className="text-slate-500 font-medium">Here is your optimized class schedule</p>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to="/courses"
                                    state={location.state} // Preserve state so selection is maintained
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    <Pencil size={16} />
                                    Edit Schedule
                                </Link>
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">
                                    <CalendarCheck size={16} />
                                    Save Schedule
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Professor</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {schedule.map((cls, idx) => (
                                        <React.Fragment key={idx}>
                                            <tr
                                                onClick={() => toggleRow(idx)}
                                                className={`group transition - colors cursor - pointer ${expandedRow === idx ? 'bg-indigo-50 hover:bg-indigo-50' : 'hover:bg-slate-50/80'} `}
                                            >
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{cls.code}</div>
                                                    <div className="text-sm text-slate-600">{cls.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <User size={16} className="text-slate-400" />
                                                        {cls.prof}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                        <Clock size={16} className="text-slate-400" />
                                                        {cls.time}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="inline-flex items-center gap-2 justify-end">
                                                        <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                                            <span className="text-amber-500">★</span>
                                                            {cls.rating}
                                                        </div>
                                                        {expandedRow === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRow === idx && (
                                                <tr className="bg-slate-50/50 animate-fade-in">
                                                    <td colSpan="4" className="p-4 border-t border-slate-100 shadow-inner">
                                                        <p className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Student Reviews</p>
                                                        {cls.reviews.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {cls.reviews.map((review, rIdx) => (
                                                                    <div key={rIdx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <span className="text-xs font-bold text-slate-700">{review.user}</span>
                                                                            <span className="text-xs font-bold text-amber-500">★ {review.rating}</span>
                                                                        </div>
                                                                        {review.comment && review.comment.trim() && <p className="text-sm text-slate-600 italic">"{review.comment}"</p>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-400 italic px-2">No reviews available yet for this professor.</p>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-400">
                                Schedule ID: #8X92-2026-SP • Generated successfully
                            </p>
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

export default ResultsPage;
