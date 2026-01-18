import React from 'react';
import { Check } from 'lucide-react';

const steps = [
    { id: 1, label: 'Rate Professors' },
    { id: 2, label: 'Select Courses' },
    { id: 3, label: 'View Schedule' },
];

const StepIndicator = ({ currentStep }) => {
    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="relative flex justify-between items-center">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full" />

                {/* Progress Line Active */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white
                  ${isActive
                                        ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow-[0_0_15px_rgba(79,70,229,0.35)] scale-110'
                                        : isCompleted
                                            ? 'border-teal-500 bg-teal-500 text-white'
                                            : 'border-slate-300 text-slate-400'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check size={20} className="stroke-[3] animate-in zoom-in duration-500" />
                                ) : (
                                    <span className={`text-sm font-semibold ${isActive ? 'font-bold' : ''}`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`
                  mt-3 text-sm font-medium transition-colors duration-300 absolute top-10 w-32 text-center
                  ${isActive
                                        ? 'text-indigo-900 font-bold'
                                        : isCompleted
                                            ? 'text-indigo-600'
                                            : 'text-slate-400'
                                    }
                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
