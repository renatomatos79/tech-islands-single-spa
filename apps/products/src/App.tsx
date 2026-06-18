import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "react-intl";
import { navigateToUrl } from "single-spa";
import { isAuthenticated } from "../../../packages/shared-auth/src";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductFormPage } from "./pages/ProductFormPage";
import { messages } from "./i18n/messages";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en" messages={messages.en}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </QueryClientProvider>
  );
}
