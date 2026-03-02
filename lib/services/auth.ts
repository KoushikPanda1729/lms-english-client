import api from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  onboardingCompleted?: boolean;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data.data.user as AuthUser;
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/login", { email, password });
    return data.data.user as AuthUser;
  },

  async googleSignIn(accessToken: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/google", { accessToken });
    return data.data.user as AuthUser;
  },

  async self(): Promise<AuthUser> {
    const { data } = await api.get("/auth/self");
    return data.data as AuthUser;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
