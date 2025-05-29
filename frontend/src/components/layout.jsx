import React from "react";
import { Sidebar } from "./Sidebar";

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64">
        {children}
      </main>
    </div>
  );
};
