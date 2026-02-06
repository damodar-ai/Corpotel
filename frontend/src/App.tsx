import React, { Suspense, lazy } from 'react';
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
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/hotels/:id" element={<HotelDetailsPage />} />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <BookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/request"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <BookingRequestPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/role-selection"
                  element={
                    <ProtectedRoute>
                      <RoleSelectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/complete-profile/hotel"
                  element={
                    <ProtectedRoute>
                      <HotelProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/complete-profile/corporate"
                  element={
                    <ProtectedRoute>
                      <CorporateProfilePage />
                    </ProtectedRoute>
                  }
                />
                {/* Corporate Routes */}
                <Route
                  path="/corporate/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <CorporateDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/corporate/offers"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <HotelPostsPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/corporate/find-hotels"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <BrowseHotelsPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/corporate/messages"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <MessagesPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/corporate/hotels/:id"
                  element={
                    <RoleBasedRoute allowedRoles={['Corporate']}>
                      <HotelDetailsPage />
                    </RoleBasedRoute>
                  }
                />
                {/* Hotel Routes */}
                <Route
                  path="/hotel/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['Hotel']}>
                      <HotelDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/hotel/posts"
                  element={
                    <RoleBasedRoute allowedRoles={['Hotel']}>
                      <ManagePostsPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/hotel/room-types"
                  element={
                    <RoleBasedRoute allowedRoles={['Hotel']}>
                      <RoomTypesPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/hotel/bookings"
                  element={
                    <RoleBasedRoute allowedRoles={['Hotel']}>
                      <HotelBookingsPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/hotel/messages"
                  element={
                    <RoleBasedRoute allowedRoles={['Hotel']}>
                      <ChatInboxPage />
                    </RoleBasedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
