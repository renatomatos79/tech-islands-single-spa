import { navigateToUrl } from "single-spa";
import { login } from "../../../packages/shared-auth/src";

function go(path: string) {
  navigateToUrl(path);
}

export default function App() {
  function handleLogin() {
    login();
    go("/user");
  }

  return (
    <main>
      <h1>Login</h1>
      <button onClick={handleLogin}>Fake Login</button>
    </main>
  );
}
