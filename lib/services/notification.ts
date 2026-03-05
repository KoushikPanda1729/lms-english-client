import api from "@/lib/api";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export const notificationService = {
  async getMyNotifications(
    page = 1,
    limit = 20,
  ): Promise<{ notifications: AppNotification[]; total: number; page: number; limit: number }> {
    const { data } = await api.get("/notifications", { params: { page, limit } });
    return data.data;
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get("/notifications/unread-count");
    return data.data.count as number;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },
};
