const TOKEN_KEY = "fake_token";

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function login() {
  localStorage.setItem(TOKEN_KEY, "fake-token");
  window.dispatchEvent(new Event("auth-changed"));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}
