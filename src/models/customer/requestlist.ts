import { PostCode } from "../home";
import { UserData } from "../user";

export interface UserRequest {
  data: Request[];
  message: string;
  status: string;
  total: number;
}

export interface Request {
  id: number;
  user_id: number;
  service_id: number;
  business_id: number;
  postcode_id: number;
  file?: any;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  request_quotes_count: number;
  leads_count: number;
  service: Service;
  answers: Answer[];
  user: UserData;
  intrests: any[];
  postcode: PostCode;
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

export interface Service {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}
