export interface RootObject {
  data: Service[];
  message: string;
  status: string;
}

export interface Service {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  data: BusinessData[];
  message: string;
  status: string;
}

export interface BusinessData {
  id: number;
  user_id: number;
  name: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
  reviews_avg_rating: number;
  reviews_count: number;
  profile_percentage: string;

  services: Service[];
}

export interface PostCode {
  data: PostCode[];
  message: string;
  status: string;
}

export interface PostCode {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  data: QuestionData[];
  next_page: string;
  message: string;
  status: string;
}

export interface QuestionData {
  id: number;
  title: string;
  service_id: number;
  answers: string[];
  created_at: string;
  updated_at: string;
}

export interface UserRequestData {
  data: UserRequest;
  message: string;
  status: string;
}

export interface UserRequest {
  user_requests: UserrequestDetail;
}

export interface UserrequestDetail {
  id: number;
  user_id: number;
  service_id: number;
  business_id?: any;
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
  question: QuestionData;
}
