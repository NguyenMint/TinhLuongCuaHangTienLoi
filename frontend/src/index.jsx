import "./index.css";
import { StrictMode } from "react";
// import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
// import { Environment } from "../environments/environment.js";
// import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
// const clientId = Environment.GG_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId={clientId}> */}
    <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>
);
