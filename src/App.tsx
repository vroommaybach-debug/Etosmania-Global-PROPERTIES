/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { InspectionModal } from './components/inspection/InspectionModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SEOHead } from './components/common/SEOHead';
import { PageLoader } from './components/common/PageLoader';
import { resolveSpaFallbackRoute } from './utils/adminAuth';

// Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { CoOwnershipPage } from './pages/CoOwnershipPage';
import { DevelopmentsPage } from './pages/DevelopmentsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fallbackRoute = resolveSpaFallbackRoute(search, hash);
    if (fallbackRoute && fallbackRoute !== pathname) {
      navigate(fallbackRoute, { replace: true });
      return;
    }
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <UIProvider>
          <ScrollToTop />
          <SEOHead />
          {/* Standard Website Loader for Every Page Transition */}
          <PageLoader />
          <div className="min-h-screen flex flex-col bg-[#FAF9FC] text-[#120721]">
            {/* Sticky Global Top Bar */}
            <Navbar />

            {/* Main Route Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/co-ownership" element={<CoOwnershipPage />} />
                <Route path="/developments" element={<DevelopmentsPage />} />
                <Route path="/developments/:id" element={<ProjectDetailPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Global Inspection Modal */}
            <InspectionModal />

            {/* Global Floating WhatsApp & Shortlist Trigger */}
            <WhatsAppButton />

            {/* Global Footer */}
            <Footer />

            {/* Sticky Mobile Bottom Navigation */}
            <MobileBottomNav />
          </div>
        </UIProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
