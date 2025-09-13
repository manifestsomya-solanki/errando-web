export interface NotificationList {
  data: Notification[];
  message: string;
  status: string;
}

export interface NotificationData {
  id: number;
  user_id: number;
  another_user_id: number;
  message: string;
  click_action: string;
  meta_data: string;
  is_read: number;
  created_at: string;
  updated_at: string;
}
