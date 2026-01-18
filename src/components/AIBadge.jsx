import React from 'react';
import { Sparkles } from 'lucide-react';

const AIBadge = () => {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 shadow-sm animate-fade-in">
            <Sparkles size={12} className="text-indigo-600" />
            <span>AI-Optimized</span>
        </div>
    );
};

export default AIBadge;
