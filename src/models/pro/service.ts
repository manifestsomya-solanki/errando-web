export interface RootObject {
    data: ServiceDataDetail;
    message: string;
    status: string;
}

export interface ServiceDataDetail {
    id: number;
    user_id: number;
    user_business_id: number;
    service_id: number;
    nation_wide: number;
    remote_service: number;
    created_at: string;
    updated_at: string;
    post_codes: Postcode2[];
}

export interface Postcode2 {
    id: number;
    service_id: number;
    user_businesses_id: number;
    postcode: string;
    radius: string;
    created_at: string;
    updated_at: string;
    postcode: Postcode;
}

export interface Postcode {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
