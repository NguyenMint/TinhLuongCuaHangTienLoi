import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layout";
import { WorkSchedule } from "./pages/WorkSchedulePage";


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
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
