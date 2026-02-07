import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import './index.css';
// Eager load: Home and Login (critical path)
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
// Lazy load: All other pages for code splitting
const HotelDetailsPage = lazy(() => import('./pages/HotelDetailsPage').then(m => ({ default: m.HotelDetailsPage })));
const BookingsPage = lazy(() => import('./pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage').then(m => ({ default: m.RoleSelectionPage })));
const HotelProfilePage = lazy(() => import('./pages/HotelProfilePage').then(m => ({ default: m.HotelProfilePage })));
const CorporateProfilePage = lazy(() => import('./pages/CorporateProfilePage').then(m => ({ default: m.CorporateProfilePage })));
const CorporateDashboard = lazy(() => import('./pages/CorporateDashboard').then(m => ({ default: m.CorporateDashboard })));
const HotelDashboard = lazy(() => import('./pages/HotelDashboard').then(m => ({ default: m.HotelDashboard })));
const HotelPostsPage = lazy(() => import('./pages/HotelPostsPage').then(m => ({ default: m.HotelPostsPage })));
const ManagePostsPage = lazy(() => import('./pages/ManagePostsPage').then(m => ({ default: m.ManagePostsPage })));
const RoomTypesPage = lazy(() => import('./pages/RoomTypesPage').then(m => ({ default: m.RoomTypesPage })));
const HotelBookingsPage = lazy(() => import('./pages/HotelBookingsPage').then(m => ({ default: m.HotelBookingsPage })));
const BrowseHotelsPage = lazy(() => import('./pages/BrowseHotelsPage').then(m => ({ default: m.BrowseHotelsPage })));
const BookingRequestPage = lazy(() => import('./pages/BookingRequestPage').then(m => ({ default: m.BookingRequestPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const ChatInboxPage = lazy(() => import('./pages/ChatInboxPage').then(m => ({ default: m.ChatInboxPage })));
// Loading fallback component
const PageLoader = () => (_jsx("div", { className: "flex items-center justify-center min-h-[50vh]", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow", children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/hotels/:id", element: _jsx(HotelDetailsPage, {}) }), _jsx(Route, { path: "/bookings", element: _jsx(ProtectedRoute, { children: _jsx(BookingsPage, {}) }) }), _jsx(Route, { path: "/bookings/request", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(BookingRequestPage, {}) }) }), _jsx(Route, { path: "/role-selection", element: _jsx(ProtectedRoute, { children: _jsx(RoleSelectionPage, {}) }) }), _jsx(Route, { path: "/complete-profile/hotel", element: _jsx(ProtectedRoute, { children: _jsx(HotelProfilePage, {}) }) }), _jsx(Route, { path: "/complete-profile/corporate", element: _jsx(ProtectedRoute, { children: _jsx(CorporateProfilePage, {}) }) }), _jsx(Route, { path: "/corporate/dashboard", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(CorporateDashboard, {}) }) }), _jsx(Route, { path: "/corporate/offers", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(HotelPostsPage, {}) }) }), _jsx(Route, { path: "/corporate/find-hotels", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(BrowseHotelsPage, {}) }) }), _jsx(Route, { path: "/corporate/messages", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(MessagesPage, {}) }) }), _jsx(Route, { path: "/corporate/hotels/:id", element: _jsx(RoleBasedRoute, { allowedRoles: ['Corporate'], children: _jsx(HotelDetailsPage, {}) }) }), _jsx(Route, { path: "/hotel/dashboard", element: _jsx(RoleBasedRoute, { allowedRoles: ['Hotel'], children: _jsx(HotelDashboard, {}) }) }), _jsx(Route, { path: "/hotel/posts", element: _jsx(RoleBasedRoute, { allowedRoles: ['Hotel'], children: _jsx(ManagePostsPage, {}) }) }), _jsx(Route, { path: "/hotel/room-types", element: _jsx(RoleBasedRoute, { allowedRoles: ['Hotel'], children: _jsx(RoomTypesPage, {}) }) }), _jsx(Route, { path: "/hotel/bookings", element: _jsx(RoleBasedRoute, { allowedRoles: ['Hotel'], children: _jsx(HotelBookingsPage, {}) }) }), _jsx(Route, { path: "/hotel/messages", element: _jsx(RoleBasedRoute, { allowedRoles: ['Hotel'], children: _jsx(ChatInboxPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }) }), _jsx(Footer, {})] }) }) }));
}
export default App;
