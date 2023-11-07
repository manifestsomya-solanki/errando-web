import { User } from "./pro/leadslist";

export interface UserData {
  available_credits: number;
  token: string;
  data: UserData;
  message: string;
  status: string;
}

export interface UserData {
  id: number;
  full_name: string;
  role: string;
  mobile_number?: any;
  address?: any;
  city?: any;
  postcode_id?: any;
  bio?: any;
  otp?: any;
  email: string;
  img_avatar?: any;
  is_email_verified: string;
  is_mobile_verified: string;
  is_verified: string;
  firebase_ids?: any;
  created_at: string;
  updated_at: string;
  metadata?: Metadatum;
}

export interface Metadatum {
  id: number;
  user_id: number;
  is_app_lead_notification_on: number;
  is_app_request_creation_notification_on: number;
  is_app_request_quote_notification_on: number;
  is_app_review_notification_on: number;
  is_app_close_request_notification_on: number;
  is_app_customer_sends_message_on: number;
  is_app_show_interest_notification_on: number;
  is_app_promotion_mail_notification_on: number;
  is_app_recieved_quote_notification_on: number;
  is_email_lead_notification_on: number;
  is_email_request_creation_notification_on: number;
  is_email_request_quote_notification_on: number;
  is_email_review_notification_on: number;
  is_email_close_request_notification_on: number;
  is_email_promotion_mail_notification_on: number;
  is_email_recieved_quote_notification_on: number;
  is_email_show_interest_notification_on: number;
  is_email_customer_sends_message_on: number;
  created_at: string;
  updated_at: string;
}

export interface OtpValues {
  mobile_number: string;
  email?: string;
}

export interface SendOtp {
  token: string;
  data: User;
  message: string;
  status: string;
}

export interface VerifyOtp {
  token: string;
  data: UserData;
  message: string;
  status: string;
}

export interface RegisterUser {
  data: Data;
  message: string;
  status: string;
}

export interface Data {
  user: UserData;
  user_requests: Userrequests;
}

export interface Userrequests {
  id: number;
  user_id: number;
  service_id?: any;
  business_id?: any;
  postcode_id?: any;
  file?: any;
  comment?: any;
  status: string;
  created_at: string;
  updated_at: string;

  user: UserData;
  service?: any;
  answers: any[];
  user_bussiness?: any;
  postcode?: any;
}
