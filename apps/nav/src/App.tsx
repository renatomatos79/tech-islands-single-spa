import { navigateToUrl } from "single-spa";
import { logout } from "../../../packages/shared-auth/src";

function go(path: string) {
  navigateToUrl(path);
}

export default function App() {
  function handleLogout() {
    logout();
    go("/login");
  }

  return (
    <nav>
      <button onClick={() => go("/")}>Home</button>
      <button onClick={() => go("/user")}>User Details</button>
      <button onClick={() => go("/products")}>Products</button>
      <button onClick={handleLogout}>Exit</button>
    </nav>
  );
}
