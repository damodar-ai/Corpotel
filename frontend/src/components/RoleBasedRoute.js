import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const RoleBasedRoute = ({ children, allowedRoles, redirectTo = '/' }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-primary", children: _jsx("div", { className: "text-white text-xl", children: "Loading..." }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login" });
    }
    if (!user?.identityType || !allowedRoles.includes(user.identityType)) {
        return _jsx(Navigate, { to: redirectTo });
    }
    return _jsx(_Fragment, { children: children });
};
