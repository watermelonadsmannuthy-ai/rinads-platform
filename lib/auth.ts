// Simple authentication utilities
// In production, replace with proper auth system (NextAuth, Auth0, etc.)

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("rinads-auth") === "true";
}

export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rinads-user");
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rinads-auth");
  localStorage.removeItem("rinads-user");
  window.location.href = "/login";
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
  return true;
}



