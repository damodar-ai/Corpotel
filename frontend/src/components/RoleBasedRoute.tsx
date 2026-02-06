import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: ('Hotel' | 'Corporate')[];
    redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/'
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user?.identityType || !allowedRoles.includes(user.identityType)) {
        return <Navigate to={redirectTo} />;
    }

    return <>{children}</>;
};
