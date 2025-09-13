import { Service } from "../home";
import { UserData } from "../user";

export interface BusinessList {
  data: Business[];
  count: number;
  total: number;
  last_page: number;
  next_page: string;
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
  reviews_avg_rating?: any;
  email: string;
  mobile_number: string;
  website_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  profile_percentage: string;
  business_postcode?: Businesspostcode;
  files: File[];
  services: Service[];
}

export interface Businesspostcode {
  id: number;
  name: string;
  latitude?: any;
  longitude?: any;
  created_at: string;
  updated_at: string;
}


export interface AddBusiness {
  name: string;
  description: string;
  profile_picture: undefined;
  service_images: FileList | undefined;
  postcode_id: number;
  postcode: string;
}

export interface AddBusinessService {
  user_business_id: number;
  service_id: number;
  radius: string[];
  postcode: string[];
  nation_wide: boolean;
  remote_service: boolean;
}

export interface EditBusinessService {
  user_business_id: number;
  service_id: number;
  radius: string[];
  postcode: { label: string; value: string }[];
  nation_wide: boolean;
  remote_service: boolean;
}

export interface AddBusinessData {
  data: AddBusinessDataRespone;
  message: string;
  status: string;
}

export interface AddBusinessDataRespone {
  id: number;
  user_id: number;
  name: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: UserData;
}

export interface ServiceList {
  data: ServiceData[];
  message: string;
  status: string;
}

export interface ServiceData {
  id: number;
  user_id?: number;
  user_business_id: number;
  service_id: number;
  nation_wide: number;
  remote_service: number;
  created_at: string;
  updated_at: string;
  user_bussiness: Userbussiness;
  service: Service;
  request_count: number;
  lead_count: number;
  post_codes: Postcode2[];
}
export interface Postcode2 {
  id: number;
  service_id: number;
  user_businesses_id: number;
  postcode_id: number;
  radius: number;
  created_at: string;
  updated_at: string;
  businesses_service_id: number;
  postcode: Postcode;
}

export interface Postcode {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface Userbussiness {
  id: number;
  user_id: number;
  name: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AddBusinessServiceData {
  data: Data;
  message: string;
  status: string;
}

export interface Data {
  id: number;
  user_id?: any;
  user_business_id: number;
  service_id: number;
  nation_wide: number;
  remote_service: number;
  created_at: string;
  updated_at: string;
  post_codes: Postcode[];
}

export interface Postcode {
  id: number;
  service_id: number;
  user_businesses_id: number;
  postcode_id: number;
  radius: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessDetail {
  data: Business;
  message: string;
  status: string;
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

export interface Contact {
  phone_number: string;
  website: string;
  support?: string;
  instagram: string;
  facebook: string;
  twitter: string;
}
