import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layout";
import ProtectedRoute from "./ProtectedRoute";
import { WorkSchedule } from "./pages/WorkSchedulePage";
// setting page
import { SettingsPage } from "./pages/SettingPage/SettingsPage";
import { ShiftPage } from "./pages/SettingPage/ShiftPage";
import { SalaryStructure } from "./pages/SettingPage/SalaryStructurePage";
import { AllowanceCoefficientPage } from "./pages/SettingPage/AllowanceCoefficientPage";
// role nhan vien page
import { EmployeeHomePage } from "./pages/EmployeeLayout/EmployeeHomePage";
import { SidebarEmployee } from "./components/SidebarEmployee";
import { AttendancePage } from "./pages/AttendancePage";
import { EmployeeProfilePage } from "./pages/EmployeeLayout/EmployeeProfilePage";
import { EmployeeUtilitiesPage } from "./pages/EmployeeLayout/EmployeeUtilitiesPage";
import { PayrollPage } from "./pages/PayrollPage";
import { ShiftRequests } from "./pages/ShiftRequestsPage";

function App() {
  const getRole = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const MaVaiTro = JSON.parse(user).MaVaiTro;
    return MaVaiTro;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lich-lam-viec"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <WorkSchedule />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dang-ky-ca"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <ShiftRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bang-cham-cong"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <AttendancePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/shift"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <ShiftPage />
              </MainLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/salary-structure"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <SalaryStructure />
              </MainLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/settings/allowance-coefficient"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <AllowanceCoefficientPage />
              </MainLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/bang-luong"
          element={
            <ProtectedRoute allowedRoles={[3, 1]}>
              <MainLayout>
                <PayrollPage />
              </MainLayout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/employee-home"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <div className="flex min-h-screen">
                <SidebarEmployee />
                <div className="flex-1 md:ml-52 lg:ml-64">
                  <EmployeeHomePage />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-profile"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <div className="flex min-h-screen">
                <SidebarEmployee />
                <div className="flex-1 md:ml-52 lg:ml-64">
                  <EmployeeProfilePage />
                </div>
              </div>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/employee-utility"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <div className="flex min-h-screen">
                <SidebarEmployee />
                <div className="flex-1 md:ml-52 lg:ml-64">
                  <EmployeeUtilitiesPage />
                </div>
              </div>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="*"
          element={
            getRole() === 2 ? (
              <div className="flex min-h-screen">
                <SidebarEmployee />
                <div className="flex-1 p-6 bg-gray-100 flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">404 - Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              </div>
            ) : (
              <MainLayout>
                <div className="flex-1 p-6 bg-gray-100 flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">404 - Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              </MainLayout>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
