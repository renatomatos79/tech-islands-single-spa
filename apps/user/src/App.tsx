import { useEffect } from "react";
import { navigateToUrl } from "single-spa";
import { isAuthenticated } from "../../../packages/shared-auth/src";

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

  return <h1>User Details</h1>;
}
