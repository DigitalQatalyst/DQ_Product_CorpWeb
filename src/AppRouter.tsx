import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, initializeMsal } from "./services/auth/msal";
import { CourseType } from "./utils/mockData";
import { AuthProvider } from "./components/Header/context/AuthContext";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { ProductMarketplacePage } from "./pages/ProductMarketplacePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { App } from "./App";
import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthorizedRoute from "./components/AuthorizedRoute";
import AboutUsPage from "./pages/AboutUsPage";
import NotFound from "./pages/NotFound";
import MediaDetailPage from "./pages/media/MediaDetailPage";
import MediaDetailBlogLayout from "./pages/media/MediaDetailBlogLayout";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import { ABBCaseStudy } from "./pages/case-studies/ABBCaseStudy";
import { PGCaseStudy } from "./pages/case-studies/PGCaseStudy";
import { CaseStudiesPage } from "./pages/case-studies/CaseStudiesPage";
// Admin UI (integrated)
import AdminDashboard from "./admin-ui/pages/Dashboard";
import AdminMediaList from "./admin-ui/pages/MediaList";
import BlogCreate from "./admin-ui/pages/BlogCreate";
import BlogDetail from "./admin-ui/pages/BlogDetail";
import AdminSettings from "./admin-ui/pages/Settings";
import AuthorManagement from "./admin-ui/pages/AuthorManagement";
import AuthorCreate from "./admin-ui/pages/AuthorCreate";
import CategoryManagement from "./admin-ui/pages/CategoryManagement";
import ContentSubmissions from "./admin-ui/pages/ContentSubmissions";
import JobApplications from "./admin-ui/pages/JobApplications";
import JobPostingsManagement from "./admin-ui/pages/JobPostingsManagement";
import JobPostingCreate from "./admin-ui/pages/JobPostingCreate";
import Analytics from "./admin-ui/pages/Analytics";
import InterviewScheduler from "./admin-ui/pages/InterviewScheduler";
import NotificationCenter from "./admin-ui/pages/NotificationCenter";
import UserManagement from "./admin-ui/pages/UserManagement";
// Forms
import NeedsAssessmentForm from "./pages/forms/NeedsAssessmentForm";
import RequestForMembership from "./pages/forms/RequestForMembership";
import RequestForFunding from "./pages/forms/RequestForFunding";
import BookConsultationForEntrepreneurship from "./pages/forms/BookConsultationForEntrepreneurship";
import CancelLoan from "./pages/forms/CancelLoan";
import CollateralUserGuide from "./pages/forms/CollateralUserGuide";
import DisburseApprovedLoan from "./pages/forms/DisburseApprovedLoan";
import FacilitateCommunication from "./pages/forms/FacilitateCommunication";
import ReallocationOfLoanDisbursement from "./pages/forms/ReallocationOfLoanDisbursement";
import RequestToAmendExistingLoanDetails from "./pages/forms/RequestToAmendExistingLoanDetails";
import TrainingInEntrepreneurship from "./pages/forms/TrainingInEntrepreneurship";
import IssueSupportLetter from "./pages/forms/IssueSupportLetter";
import GrowthAreasMarketplace from "./pages/GrowthAreasMarketplace";
import GrowthAreasPage from "./pages/GrowthAreasPage";
import BusinessDirectoryMarketplace from "./pages/BusinessDirectoryMarketplace";
import { ComingSoon } from "./pages/ComingSoon";
import WomenEntrepreneursHub from "./pages/WomenEntrepreneursHub";
import DtmiLandingPage from "./pages/dtmi/DtmiLandingPage";
import ContributorsMarketplacePage from "./pages/dtmi/ContributorsMarketplacePage";
import ViewArticlePage from "./pages/dtmi/ViewArticlePage";
import ResearchReportPage from "./pages/ResearchReportPage";
import ResearchReportDetailPage from "./pages/ResearchReportDetailPage";
import WhitepaperDetailPage from "./pages/WhitepaperDetailPage";
import WhitepaperScrollPage from "./pages/WhitepaperScrollPage";
import MyDQPage from "./pages/MyDQPage";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import SavedItemsPage from "./pages/dashboard/SavedItemsPage";
import EmailSubscriptionsPage from "./pages/dashboard/EmailSubscriptionsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardContent from "./pages/dashboard/DashboardContent";
import ActivityCentre from "./pages/dashboard/ActivityCentre";
import MyContentPage from "./pages/dashboard/MyContentPage";
import BlogListPage from "./pages/blog/BlogListPage";
import BlogPage from "./pages/blog/BlogPage";
import { AuthorBioPage } from "./pages/AuthorBioPage/AuthorBioPage";
import ConsultationPage from "./pages/ConsultationPage";
import RequestDemoPage from "./pages/RequestDemoPage";
import ServiceRequestForm from "./pages/forms/ServiceRequestForm";
import ProductDemoRequestForm from "./pages/forms/ProductDemoRequestForm";
import TourRequestForm from "./pages/forms/TourRequestForm";
import ExpertInterviewPage from "./pages/expert-interviews/ExpertInterviewPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import CareersPage from "./pages/CareersPage";
import JobListingsPage from "./pages/JobListingsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ProductsLandingPage from "./pages/ProductsLandingPage";
import PodcastDetailPage from "./pages/PodcastDetailPage";
import JobApplicationForm from "./pages/forms/JobApplicationForm";
import NewsletterSignupPage from "./pages/NewsletterSignupPage";
import SectorLandingPage from "./pages/sectors/SectorLandingPage";
import { ClientTestimonialsPage } from "./pages/ClientTestimonialsPage";
import LoginPage from "./pages/LoginPage";

export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);

  // Initialize MSAL on component mount
  useEffect(() => {
    initializeMsal();
  }, []);

  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (
      compareCourses.length < 3 &&
      !compareCourses.some((c) => c.id === course.id)
    ) {
      setCompareCourses((prev) => [...prev, course]);
    }
  };

  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/courses" element={<App />} />
            <Route path="/products" element={<ProductsLandingPage />} />
            <Route
              path="/products/marketplace"
              element={<ProductMarketplacePage />}
            />
            <Route
              path="/products/:productId"
              element={<ProductDetailPage />}
            />
            <Route
              path="/courses/:itemId"
              element={
                <MarketplaceDetailsPage
                  marketplaceType="courses"
                  bookmarkedItems={bookmarkedCourses}
                  onToggleBookmark={toggleBookmark}
                  onAddToComparison={handleAddToComparison}
                />
              }
            />
            <Route path="/marketplace/*" element={<MarketplaceRouter />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardContent />} />
              <Route path="activity" element={<ActivityCentre />} />
              <Route path="my-content" element={<MyContentPage />} />
              <Route path="saved-items" element={<SavedItemsPage />} />
              <Route
                path="subscriptions"
                element={<EmailSubscriptionsPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route
              path="/women-entrepreneurs"
              element={<WomenEntrepreneursHub />}
            />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route
              path="/growth-areas-marketplace"
              element={<GrowthAreasMarketplace />}
            />
            <Route path="/growth-areas" element={<GrowthAreasPage />} />
            <Route
              path="/business-directory-marketplace"
              element={<BusinessDirectoryMarketplace />}
            />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/coming-soon/:feature" element={<ComingSoon />} />

            {/* Documentation routes - redirect to coming soon */}
            <Route
              path="/documentation"
              element={<Navigate to="/coming-soon/documentation" replace />}
            />
            <Route
              path="/documentation/*"
              element={<Navigate to="/coming-soon/documentation" replace />}
            />
            <Route
              path="/admin-ui/settings"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin"]}
                  deniedMessage="Settings are restricted to administrators only."
                >
                  <AdminSettings />
                </AuthorizedRoute>
              }
            />
            {/* Embedded Admin UI - role-protected */}
            <Route
              path="/admin-ui/dashboard"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin", "creator", "HR-Admin", "HR-viewer"]}
                  deniedMessage="The admin dashboard requires admin, creator, or HR access."
                >
                  <AdminDashboard />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/media"
              element={
                <AuthorizedRoute allowedRoles={["admin", "creator"]}>
                  <AdminMediaList />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/media/new"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin", "creator"]}
                  requiredPermission={{ resource: "blogs", action: "create" }}
                >
                  <BlogCreate />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/media/:id"
              element={
                <AuthorizedRoute allowedRoles={["admin", "creator"]}>
                  <BlogDetail />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/authors"
              element={
                <AuthorizedRoute allowedRoles={["admin", "creator"]}>
                  <AuthorManagement />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/authors/new"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin"]}
                  deniedMessage="Creating authors requires admin access."
                >
                  <AuthorCreate />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/categories"
              element={
                <AuthorizedRoute allowedRoles={["admin"]}>
                  <CategoryManagement />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/submissions"
              element={
                <AuthorizedRoute allowedRoles={["admin", "creator"]}>
                  <ContentSubmissions />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/job-applications"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin", "HR-Admin", "HR-viewer"]}
                  deniedMessage="Job applications are restricted to administrators and HR roles."
                >
                  <JobApplications />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/job-postings"
              element={
                <AuthorizedRoute allowedRoles={["admin", "HR-Admin"]}>
                  <JobPostingsManagement />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/job-postings/new"
              element={
                <AuthorizedRoute allowedRoles={["admin", "HR-Admin"]}>
                  <JobPostingCreate />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/analytics"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin", "HR-Admin", "HR-viewer"]}
                >
                  <Analytics />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/interviews"
              element={
                <AuthorizedRoute allowedRoles={["admin", "HR-Admin"]}>
                  <InterviewScheduler />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/notifications"
              element={
                <AuthorizedRoute allowedRoles={["admin", "creator"]}>
                  <NotificationCenter />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/admin-ui/users"
              element={
                <AuthorizedRoute
                  allowedRoles={["admin"]}
                  deniedMessage="User management is restricted to administrators only."
                >
                  <UserManagement />
                </AuthorizedRoute>
              }
            />
            {/** Forms routes - all protected */}
            <Route
              path="/forms/needs-assessment"
              element={
                <ProtectedRoute>
                  <NeedsAssessmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/request-for-membership"
              element={
                <ProtectedRoute>
                  <RequestForMembership />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/request-for-funding"
              element={
                <ProtectedRoute>
                  <RequestForFunding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/book-consultation"
              element={
                <ProtectedRoute>
                  <BookConsultationForEntrepreneurship />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/cancel-loan"
              element={
                <ProtectedRoute>
                  <CancelLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/collateral-user-guide"
              element={
                <ProtectedRoute>
                  <CollateralUserGuide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/disburse-approved-loan"
              element={
                <ProtectedRoute>
                  <DisburseApprovedLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/facilitate-communication"
              element={
                <ProtectedRoute>
                  <FacilitateCommunication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/reallocation-of-loan-disbursement"
              element={
                <ProtectedRoute>
                  <ReallocationOfLoanDisbursement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/request-to-amend-existing-loan-details"
              element={
                <ProtectedRoute>
                  <RequestToAmendExistingLoanDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/training-in-entrepreneurship"
              element={
                <ProtectedRoute>
                  <TrainingInEntrepreneurship />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/issue-support-letter"
              element={
                <ProtectedRoute>
                  <IssueSupportLetter />
                </ProtectedRoute>
              }
            />

            <Route path="/dtmi" element={<DtmiLandingPage />} />
            <Route
              path="/dtmi/contributors"
              element={<ContributorsMarketplacePage />}
            />
            <Route path="/dtmi/article/:slug" element={<ViewArticlePage />} />
            <Route
              path="/newsletter-signup"
              element={<NewsletterSignupPage />}
            />

            {/* Sector Landing Pages */}
            <Route path="/sectors/:sectorId" element={<SectorLandingPage />} />

            <Route path="/research-report" element={<ResearchReportPage />} />
            <Route
              path="/research-report/:slug"
              element={<ResearchReportDetailPage />}
            />
            <Route
              path="/report/:slug"
              element={<ResearchReportDetailPage />}
            />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/authors/:slug" element={<AuthorBioPage />} />
            <Route path="/my-dq" element={<MyDQPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/client-testimonials" element={<CaseStudiesPage />} />
            <Route
              path="/client-testimonials/abb-dbp-design"
              element={<ABBCaseStudy />}
            />
            <Route
              path="/client-testimonials/pg-digital-research"
              element={<PGCaseStudy />}
            />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/request-demo" element={<RequestDemoPage />} />
            <Route
              path="/forms/service-request"
              element={<ServiceRequestForm />}
            />
            <Route
              path="/forms/product-demo/:productCode"
              element={
                <ProtectedRoute>
                  <ProductDemoRequestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms/tour-request"
              element={
                <ProtectedRoute>
                  <TourRequestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert-interviews/:slug"
              element={<ExpertInterviewPage />}
            />
            <Route path="/whitepaper/:id" element={<WhitepaperDetailPage />} />
            <Route
              path="/whitepaper/digital-economy-4-0"
              element={<WhitepaperScrollPage />}
            />
            <Route path="/podcast/:id" element={<PodcastDetailPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route
              path="/jobs/:jobId/apply"
              element={
                <ProtectedRoute>
                  <JobApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route path="/media/blog/:id" element={<BlogPage />} />
            <Route
              path="/media/:type/:id"
              element={<MediaDetailBlogLayout />}
            />
            <Route path="/:type/:id" element={<MediaDetailPage />} />
            <Route path="/podcast/:id" element={<PodcastDetailPage />} />
            <Route path="/404" element={<NotFound />} />

            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </MsalProvider>
    </BrowserRouter>
  );
}
