import { User } from "../pro/leadslist";
import { Respondedrequest } from "./servicelist";

export interface RootObject {
  data: Business;
  message: string;
  status: string;
}

export interface Business {
  id: number;
  user_id: number;
  name: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
  reviews_avg_rating: number;
  reviews_count: number;
  files: File[];
  services: Service[];
  is_responded: boolean;
  is_interest: boolean;
  is_quote_requested: boolean;
  email?: any;
  mobile_number: string;
  website_url: string;
  facebook_url?: any;
  twitter_url?: any;
  instagram_url?: any;
  request_quotes: Requestquote[];
  requested_quotes_on_business: Requestedquotesonbusiness[];
  responded_requests: Respondedrequest[];
  business_postcode: BusinessPostCode;
  user: User;
}

export interface Requestedquotesonbusiness {
  id: number;
  user_request_id: number;
  user_business_id: number;
  customer_id: number;
  created_at: string;
  updated_at: string;
}
export interface Notinteresteduserrequest {
  id: number;
  user_request_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  laravel_through_key: number;
}
export interface Service {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}
export interface BusinessPostCode {
  id: number;
  name: string;
  distance: string;
  latitude: string;
  longitude: string;
}
export interface File {
  id: number;
  user_id: number;
  fileable_type: string;
  fileable_id: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export interface Requestquote {
  id: number;
  user_request_id: number;
  user_business_id: number;
  quote: number;
  payment_type: string;
  created_at: string;
  updated_at: string;
}
