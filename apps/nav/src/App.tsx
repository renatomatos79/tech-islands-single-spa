import { useEffect, useState } from "react";
import { navigateToUrl } from "single-spa";
import { logout } from "../../../packages/shared-auth/src";
import "./App.css";

const routes = [
  { path: "/", label: "Home" },
  { path: "/user", label: "User Details" },
  { path: "/products", label: "Products" },
];

function go(path: string) {
  navigateToUrl(path);
}

function getCurrentPath() {
  return window.location.pathname;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    function syncCurrentPath() {
      setCurrentPath(getCurrentPath());
    }

    window.addEventListener("single-spa:routing-event", syncCurrentPath);
    window.addEventListener("popstate", syncCurrentPath);

    return () => {
      window.removeEventListener("single-spa:routing-event", syncCurrentPath);
      window.removeEventListener("popstate", syncCurrentPath);
    };
  }, []);

  function handleLogout() {
    logout();
    go("/login");
  }

  return (
    <nav className="app-nav">
      {routes.map((route) => {
        const active = currentPath === route.path;

        return (
          <button
            aria-current={active ? "page" : undefined}
            className={active ? "app-nav__button app-nav__button--active" : "app-nav__button"}
            key={route.path}
            onClick={() => go(route.path)}
          >
            {route.label}
          </button>
        );
      })}
      <button className="app-nav__button app-nav__button--exit" onClick={handleLogout}>
        Exit
      </button>
    </nav>
  );
}
