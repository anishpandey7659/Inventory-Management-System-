import BillingPage from "./pages/Billingpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';
import InventoryPage from './pages/Inventory';  
import Dashboard from './pages/Dashboard';  
import Reports from './pages/Report';
import BillingHistory from './pages/Billinghistory';
import ProfilePage from "./pages/Profile";
import HomePage from "./pages/Homepage";
import Authprovider from "./context/Authprovider";
import Privateroute from "./routes/Privateroute";
import SuppliersManagement from "./features/company/Suppliers management";
import CompanyAccountForm from "./features/company/CompanyAccountForm";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <>

      <Authprovider>
        <BrowserRouter>
          <Routes>
            <Route path="/"element={<HomePage/>}/>
              <Route path="/company-form"element={<CompanyAccountForm/>}/>
            <Route element={
              <Privateroute>
                <Layout />
              </Privateroute>
            }>
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/profile-page" element={<ProfilePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/report" element={<Reports />} />
              <Route path="/billinghistory" element={<BillingHistory />} />
              <Route path="/suppliers" element={<SuppliersManagement />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
          

        </Routes>
      </BrowserRouter>
    </Authprovider>
    
    </>
  );
}


export default App;

