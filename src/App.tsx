import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import ClientDetails from './pages/clients/ClientDetails';
import CaseList from './pages/cases/CaseList';
import CaseForm from './pages/cases/CaseForm';
import CaseDetails from './pages/cases/CaseDetails';
import HearingCalendar from './pages/hearings/HearingCalendar';
import UploadLinkForm from './pages/documents/UploadLinkForm';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceForm from './pages/invoices/InvoiceForm';
import AdvocateForm from './pages/advocates/AdvocateForm';
import AdvocateList from './pages/advocates/AdvocateList';
import AdvocateDetails from './pages/advocates/AdvocateDetails';
import NotFound from './pages/NotFound';
import Loading from './components/common/Loading';

function App() {
  const { isAuthenticated, isInitialized, userRole } = useAuth();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const timeout = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<Layout isLoading={isPageLoading} />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/clients">
              <Route index element={<ClientList />} />
              <Route path="new" element={<ClientForm />} />
              <Route path=":id/edit" element={<ClientForm />} />
              <Route path=":id" element={<ClientDetails />} />
            </Route>
            
            <Route path="/cases">
              <Route index element={<CaseList />} />
              <Route path="new" element={<CaseForm />} />
              <Route path=":id/edit" element={<CaseForm />} />
              <Route path=":id" element={<CaseDetails />} />
            </Route>
            
            <Route path="/calendar" element={<HearingCalendar />} />
            
            <Route path="/document-links">
              <Route index element={<UploadLinkForm />} />
              <Route path="new" element={<UploadLinkForm />} />
            </Route>
            
            <Route path="/invoices">
              <Route index element={<InvoiceList />} />
              <Route path="new" element={<InvoiceForm />} />
              <Route path=":id/edit" element={<InvoiceForm />} />
            </Route>
            
            {/* Super-admin only routes */}
            {userRole === 'super-admin' && (
              <Route path="/advocates">
                <Route index element={<AdvocateList />} />
                <Route path="new" element={<AdvocateForm />} />
                <Route path=":id" element={<AdvocateDetails />} />
                <Route path=":id/edit" element={<AdvocateForm />} />
              </Route>
            )}
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;