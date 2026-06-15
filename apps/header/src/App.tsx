import { useEffect, useState } from "react";
import { navigateToUrl } from "single-spa";
import {
  isAuthenticated,
  shouldShowHeader,
} from "../../../packages/shared-auth/src";

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [visible, setVisible] = useState(shouldShowHeader);

  useEffect(() => {
    function syncHeaderState() {
      setAuthenticated(isAuthenticated());
      setVisible(shouldShowHeader());
    }

    window.addEventListener("auth-changed", syncHeaderState);
    window.addEventListener("single-spa:routing-event", syncHeaderState);
    window.addEventListener("popstate", syncHeaderState);
    window.addEventListener("storage", syncHeaderState);

    return () => {
      window.removeEventListener("auth-changed", syncHeaderState);
      window.removeEventListener("single-spa:routing-event", syncHeaderState);
      window.removeEventListener("popstate", syncHeaderState);
      window.removeEventListener("storage", syncHeaderState);
    };
  }, []);

  if (!visible) return null;

  return (
    <header>
      <h2>React 19 single-spa App</h2>
      {!authenticated && (
        <a
          href="/login"
          onClick={(event) => {
            event.preventDefault();
            navigateToUrl("/login");
          }}
        >
          Login
        </a>
      )}
    </header>
  );
}
