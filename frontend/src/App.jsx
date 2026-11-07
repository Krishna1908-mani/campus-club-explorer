import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Common Components
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollProgress from './components/common/ScrollProgress.jsx';
import BackToTop from './components/common/BackToTop.jsx';

// Pages
import Home from './pages/Home.jsx';
import ExploreClubs from './pages/ExploreClubs.jsx';
import ClubDetails from './pages/ClubDetails.jsx';
import Events from './pages/Events.jsx';
import Categories from './pages/Categories.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import RoleLogin from './pages/RoleLogin.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ClubLeadDashboard from './pages/ClubLeadDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

// Scroll to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollProgress />
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-gray-50/60 text-gray-900 dark:bg-dark-bg dark:text-gray-100 transition-colors duration-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/clubs" element={<ExploreClubs />} />
                  <Route path="/clubs/:id" element={<ClubDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<RoleLogin role="admin" />} />
                  <Route path="/club-lead/login" element={<RoleLogin role="club_lead" />} />
                  <Route path="/student/login" element={<RoleLogin role="student" />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Student Protected Route */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Club Lead Protected Route */}
                  <Route
                    path="/club-lead/dashboard"
                    element={
                      <ProtectedRoute requireClubLead={true}>
                        <ClubLeadDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lead/dashboard"
                    element={
                      <ProtectedRoute requireClubLead={true}>
                        <ClubLeadDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <BackToTop />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

