import { isAuthenticated } from "../../../packages/shared-auth/src";

export default function App() {
  if (!isAuthenticated()) {
    return <main></main>;
  }

  return (
    <main>
      <h1>Home</h1>
      <p>You are authenticated.</p>
    </main>
  );
}