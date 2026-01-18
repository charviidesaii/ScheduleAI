import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { Star, User, ChevronDown, ArrowLeft } from 'lucide-react';

const RateProfessorsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [professors, setProfessors] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedProf, setSelectedProf] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const DEFAULT_COURSE_MAP = {
        "Dr. Sarah Miller": "Intro to CS",
        "Prof. James Chen": "Calculus II",
        "Dr. Emily Johnson": "Gen Physics I",
        "Prof. Michael Ross": "History",
        "Staff": "Art History"
    };

    // New state for adding a professor
    const [newProfName, setNewProfName] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [days, setDays] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (startTime && endTime && startTime >= endTime) {
            setError('End time must be after start time');
        } else {
            setError('');
        }
    }, [startTime, endTime]);

    useEffect(() => {
        fetch('http://localhost:3001/api/professors')
            .then(res => res.json())
            .then(data => {
                if (data.data) setProfessors(data.data);
            })
            .catch(err => console.error("Error fetching professors:", err));

        fetch('http://localhost:3001/api/reviews')
            .then(res => res.json())
            .then(data => {
                if (data.data) setReviews(data.data);
            })
            .catch(err => console.error("Error fetching reviews:", err));

        fetch('http://localhost:3001/api/courses')
            .then(res => res.json())
            .then(data => {
                if (data.data) setCourses(data.data);
            })
            .catch(err => console.error("Error fetching courses:", err));
    }, []);

    const handleSubmit = async () => {
        const isNew = selectedProf === 'add_new';
        let profId = selectedProf;
        let profName = professors.find(p => p.id == selectedProf)?.name;

        // Clear previous errors
        setError('');

        if (isNew) {
            profName = newProfName;
            // 1. Add Professor
            try {
                const profRes = await fetch('http://localhost:3001/api/professors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newProfName, department: 'N/A' }) // Department optional for now
                });
                if (!profRes.ok) throw new Error('Failed to create professor');
                const profData = await profRes.json();
                profId = profData.data.id;

                // 2. Add Course (Subject)
                const courseId = newSubject.toUpperCase().slice(0, 8);
                const courseRes = await fetch('http://localhost:3001/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: courseId,
                        name: newSubject,
                        credits: 3,
                        days: days,
                        start_time: startTime,
                        end_time: endTime
                    })
                });
                if (!courseRes.ok) throw new Error('Failed to create course');

            } catch (error) {
                console.error("Error saving new data:", error);
                setError('Failed to save new professor/course details. Please try again.');
                return;
            }
        }

        // 3. Add Review
        /* 
           Ideally we should map course ID here correctly. 
           For existing professors, we don't know the course they teach from select.
           Optimistically, let's just save the review.
        */
        const courseId = isNew ? newSubject.toUpperCase().slice(0, 8).trim() : 'General';

        try {
            const reviewRes = await fetch('http://localhost:3001/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    professor_name: profName,
                    user_name: "You",
                    rating: rating,
                    comment: comment,
                    course_id: courseId
                })
            });

            if (!reviewRes.ok) throw new Error('Failed to submit review');

            navigate('/courses', {
                state: {
                    newCourse: isNew ? { name: newSubject, id: newSubject.toUpperCase().slice(0, 8), credits: 3 } : null,
                    submittedReview: {
                        profName: profName,
                        rating: rating,
                        comment: comment,
                        user: "You"
                    }
                }
            });

        } catch (error) {
            console.error("Error saving review:", error);
            setError('Failed to submit review. Server might be down.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">



            {!location.state?.fromNavbar && <StepIndicator currentStep={1} />}


            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">Rate Your Professors</h2>
                            <p className="mt-4 text-slate-600">Help the AI understand your teaching style preferences.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Professor Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Select Professor
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedProf}
                                        onChange={(e) => setSelectedProf(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-4 pr-10 transition-shadow outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Choose a professor...</option>
                                        {professors.map((prof) => {
                                            const relevantReviews = reviews.filter(r => r.professor_name === prof.name);
                                            const courseNameFromReview = courses.find(c => c.id === relevantReviews.find(r => r.course_id !== 'General')?.course_id)?.name;

                                            const avgRating = relevantReviews.length > 0
                                                ? (relevantReviews.reduce((acc, r) => acc + r.rating, 0) / relevantReviews.length).toFixed(1)
                                                : null;

                                            return (
                                                <option key={prof.id} value={prof.id}>
                                                    {prof.name} - {DEFAULT_COURSE_MAP[prof.name] || courseNameFromReview || prof.department || 'General'} {avgRating ? `(★${avgRating})` : ''}
                                                </option>
                                            );
                                        })}
                                        <option value="add_new">+ Add New Professor</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">Search by name or department code</p>
                            </div>

                            {/* New Professor Fields */}
                            {selectedProf === 'add_new' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-fade-in">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                            Professor Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newProfName}
                                            onChange={(e) => setNewProfName(e.target.value)}
                                            placeholder="e.g. Dr. John Doe"
                                            className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                            Subject / Course
                                        </label>
                                        <input
                                            type="text"
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            placeholder="e.g. Biology 101"
                                            className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                            Days of the Week
                                        </label>
                                        <input
                                            type="text"
                                            value={days}
                                            onChange={(e) => setDays(e.target.value)}
                                            placeholder="e.g. Mon, Wed, Fri"
                                            className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-indigo-900 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className={`w-full p-3 bg-white border ${error ? 'border-red-300 focus:ring-red-200' : 'border-indigo-200 focus:ring-indigo-500'} rounded-lg text-slate-900 outline-none`}
                                        />
                                    </div>
                                    {error && (
                                        <div className="sm:col-span-2 text-red-500 text-sm font-medium animate-pulse">
                                            ⚠️ {error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* General Error Display */}
                            {error && selectedProf !== 'add_new' && (
                                <div className="text-red-500 text-sm font-medium animate-pulse p-4 bg-red-50 rounded-lg border border-red-100">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Overall Rating
                                </label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className="group p-1 focus:outline-none transition-transform hover:scale-110"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors duration-200 ${star <= (hoveredRating || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-center text-xs text-slate-400">1 = Poor, 5 = Excellent</p>
                            </div>

                            {/* Comment Section */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Additional Comments (Optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-900 placeholder:text-slate-400"
                                    placeholder="Share your experience with this professor..."
                                />
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!(selectedProf === 'add_new' ? (newProfName && newSubject && days && startTime && endTime) : selectedProf) || !rating || error}
                                    className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300
                    ${(!(selectedProf === 'add_new' ? (newProfName && newSubject && days && startTime && endTime) : selectedProf) || !rating || error)
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
                                        }
                  `}
                                >
                                    Submit Review
                                </button>

                                {
                                    !location.state?.fromNavbar && (
                                        <button
                                            onClick={() => navigate('/courses')}
                                            className="w-full py-3 px-6 rounded-xl font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        >
                                            Skip for now
                                        </button>
                                    )
                                }
                            </div>
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

        </div >
    );
};

export default RateProfessorsPage;
