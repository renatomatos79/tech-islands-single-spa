import { useEffect } from "react";
import { navigateToUrl } from "single-spa";
import { isAuthenticated } from "../../../packages/shared-auth/src";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductFormPage } from "./pages/ProductFormPage";

function go(path: string) {
  navigateToUrl(path);
}

export default function App() {
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      go("/login");
    }
  }, [authenticated]);

  if (!authenticated) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
