export interface RootObject {
  data: LeadsDetail;
  message: string;
  status: string;
}

export interface LeadsDetail {
  id: number;
  user_request_id: number;
  user_bussiness_id: number;
  customer_id: number;
  credits: string;
  is_outright: number;
  is_credit_paid: number;
  created_at?: any;
  updated_at?: any;
  user_request: Userrequest;
  user_bussiness: Userbussiness;
  customer: User;
}

export interface Userbussiness {
  id: number;
  user_id: number;
  name: string;
  image: string;
  description: string;
  email?: any;
  mobile_number?: any;
  website_url?: any;
  facebook_url?: any;
  twitter_url?: any;
  instagram_url?: any;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface User {
  id: number;
  full_name: string;
  mobile_number: string;
  address: string;
  city: string;
  postcode_id: number;
  bio: string;
  email: string;
  is_email_verified: string;
  is_mobile_verified: string;
  img_avatar: string;
  created_at: string;
  updated_at: string;
}

export interface Userrequest {
  id: number;
  user_id: number;
  service_id: number;
  postcode_id: number;
  file?: any;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  user_request_id: number;
  question_id: number;
  answer: string;
  created_at: string;
  updated_at: string;
  question: Question;
}

export interface Question {
  id: number;
  title: string;
  service_id: number;
  answers: string[];
  created_at: string;
  updated_at: string;
}
