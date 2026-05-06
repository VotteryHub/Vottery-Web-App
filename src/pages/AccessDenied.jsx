import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';


const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-xl border border-border">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m-3-3h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2zm7-3a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-onBackground mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-onBackground mb-4">Access Denied</h2>
                <p className="text-onBackground/70 mb-8">
                    You don't have permission to access this area. This feature may be restricted to specific roles or currently disabled.
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                        Return to Home Dashboard
                    </button>
                    <BackButton 
                        className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex justify-center" 
                    />

                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
