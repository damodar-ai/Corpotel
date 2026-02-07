import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleAuthUrl, setGoogleAuthUrl] = useState('');
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const { getGoogleAuthUrl, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        setLogs((prev) => [...prev, logMessage]);
    };
    useEffect(() => {
        addLog('LoginPage mounted');
        // Check if returning from Google OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        addLog(`URL params - code: ${code ? 'present' : 'missing'}, state: ${state}`);
        if (code && state === 'google-auth') {
            addLog('Google OAuth callback detected, processing authorization code');
            handleGoogleCallback(code);
        }
        else {
            addLog('Loading Google authentication URL');
            loadGoogleAuthUrl();
        }
    }, []);
    const loadGoogleAuthUrl = async () => {
        try {
            addLog('Requesting Google auth URL from backend');
            const url = await getGoogleAuthUrl();
            addLog(`Google auth URL received successfully`);
            setGoogleAuthUrl(url);
        }
        catch (err) {
            const errorMsg = `Failed to load Google auth URL: ${err.message}`;
            addLog(errorMsg);
            console.error(errorMsg, err);
            setError('Failed to initialize Google login. Please refresh the page.');
        }
    };
    const handleGoogleCallback = async (code) => {
        setLoading(true);
        try {
            addLog(`Processing OAuth code: ${code.substring(0, 20)}...`);
            addLog('Sending authorization code to backend for token exchange');
            await loginWithGoogle(code);
            addLog('Token exchange successful, user authenticated');
            const savedUser = localStorage.getItem('user');
            const user = savedUser ? JSON.parse(savedUser) : null;
            addLog('Removing code from URL');
            window.history.replaceState({}, document.title, '/login');
            if (user) {
                if (!user.identityType) {
                    addLog('Redirecting to /role-selection');
                    navigate('/role-selection');
                }
                else if (!user.isProfileCompleted) {
                    addLog(`Redirecting to /complete-profile/${user.identityType.toLowerCase()}`);
                    navigate(`/complete-profile/${user.identityType.toLowerCase()}`);
                }
                else {
                    addLog('Redirecting to /hotels');
                    navigate('/hotels');
                }
            }
            else {
                navigate('/hotels');
            }
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Google login failed';
            addLog(`Authentication failed: ${errorMsg}`);
            console.error('Google login error:', err);
            setError(errorMsg);
            window.history.replaceState({}, document.title, '/login');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = () => {
        if (googleAuthUrl) {
            addLog('User clicked Google login button');
            addLog('Redirecting to Google OAuth consent screen');
            window.location.href = googleAuthUrl;
        }
        else {
            addLog('Error: Google auth URL not available');
            setError('Google login not available. Please refresh the page.');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans", children: [_jsxs("div", { className: "w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start", children: [_jsx("div", { className: "order-1 lg:order-2 w-full max-w-md mx-auto", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 lg:p-10 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight", children: "Login to CorpHotel" }), _jsx("p", { className: "text-slate-500 mt-3 text-sm lg:text-base", children: "Secure access for corporate partners & hoteliers." })] }), _jsxs("div", { className: "space-y-6", children: [error && (_jsxs("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2", children: [_jsx("svg", { className: "w-5 h-5 text-red-600 shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("p", { className: "text-sm text-red-700 font-medium", children: error })] })), _jsx("div", { className: "relative group", children: _jsxs("button", { onClick: handleGoogleLogin, disabled: loading || !googleAuthUrl, className: "w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-100 outline-none", children: [loading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsx("div", { className: "p-1 bg-white rounded-full", children: _jsx("img", { src: "https://www.google.com/favicon.ico", alt: "G", className: "w-4 h-4" }) })), _jsx("span", { className: "text-lg", children: "Continue with Google" })] }) }), _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-xs text-slate-400 font-medium bg-slate-50/50 py-2 px-4 rounded-full inline-block", children: "Powered by Enterprise SSO" }) }), _jsx("div", { className: "pt-6 border-t border-slate-100 text-center", children: _jsx("p", { className: "text-slate-500 text-sm", children: "Access your dashboard to manage bookings, hotels, and communication." }) }), _jsxs("div", { className: "pt-4 flex justify-center gap-2 items-center text-[10px] uppercase font-bold text-slate-300 tracking-widest", children: [_jsx("span", { children: "Secure Platform" }), _jsx("span", { className: "w-1 h-1 bg-slate-300 rounded-full" }), _jsx("span", { children: "VeriSign Checked" })] })] })] }) }), _jsxs("div", { className: "order-2 lg:order-1 space-y-6 pt-4 lg:pt-0", children: [_jsx("div", { className: "mb-6 lg:mb-10", children: _jsxs("h2", { className: "text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight", children: ["Corporate Travel,", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600", children: "Simplified." })] }) }), _jsx("div", { className: "bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600", children: _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-800 mb-2", children: "What is CorpHotel?" }), _jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: "A dedicated platform connecting corporate entities with verified, business-ready hotels. Designed specifically for seamless meetings, events, and employee stays." })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600", children: _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-800 mb-2", children: "Why CorpHotel?" }), _jsxs("ul", { className: "space-y-2 text-sm text-slate-600", children: [_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), "Verified corporate-ready venues"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), "Centralized booking & communication"] }), _jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), "Trusted by businesses and hotels"] })] })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600", children: _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-800 mb-2", children: "How It Helps You" }), _jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: "Streamlines procurement for corporates and boosts visibility for premium hotels. Efficient, transparent, and built for business growth." })] })] }) })] })] }), _jsx("button", { onClick: () => setShowLogs(!showLogs), className: "fixed bottom-4 right-4 text-[10px] text-slate-300 hover:text-slate-500 font-mono transition-colors z-50", children: showLogs ? 'Hide Console' : 'Console' }), showLogs && (_jsxs("div", { className: "fixed bottom-10 right-4 w-80 bg-slate-900/95 backdrop-blur rounded-lg p-3 text-[10px] text-green-400 font-mono border border-slate-700 shadow-2xl z-50", children: [_jsxs("div", { className: "flex justify-between items-center mb-2 pb-2 border-b border-white/10", children: [_jsx("span", { className: "font-bold text-white", children: "DEBUG_LOGS" }), _jsx("button", { onClick: () => setLogs([]), className: "text-red-400 hover:text-white", children: "CLEAR" })] }), _jsx("div", { className: "h-40 overflow-y-auto space-y-1", children: logs.length === 0 ? _jsx("span", { className: "text-slate-500 italic", children: "No events..." }) : logs.map((l, i) => _jsx("div", { children: l }, i)) })] }))] }));
};
