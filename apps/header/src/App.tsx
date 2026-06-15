import { useEffect, useState } from "react";
import { navigateToUrl } from "single-spa";
import { isAuthenticated } from "../../../packages/shared-auth/src";

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    function syncAuthState() {
      setAuthenticated(isAuthenticated());
    }

    window.addEventListener("auth-changed", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("auth-changed", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

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
