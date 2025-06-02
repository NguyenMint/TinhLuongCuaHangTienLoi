import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layout";
import { WorkSchedule } from "./pages/WorkSchedulePage";
import { SettingsPage } from "./pages/SettingPage/SettingsPage";
import {ShiftPage} from "./pages/SettingPage/ShiftPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/lich-lam-viec"
          element={
            <MainLayout>
              <WorkSchedule />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          }
        ></Route>
        <Route
          path="/settings/shift"
          element={
            <MainLayout>
              <ShiftPage/>
            </MainLayout>
          }
        ></Route>
         <Route
          path="*"
          element={
            <MainLayout>
              <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold">404 - Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            </MainLayout>
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
