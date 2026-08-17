import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== null;
  const principal = identity ? identity.getPrincipal().toText() : null;

  return {
    isAuthenticated,
    login: async () => {
      await login();
    },
    logout: async () => {
      await clear();
    },
    principal,
    loginStatus,
  };
}
