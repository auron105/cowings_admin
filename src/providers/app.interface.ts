export interface sys_list {
    name: string;
    value: string;
};

export interface get_areaid_list {
    sys_id: string;
}
export interface areaid_list_obj {
    area_id: string;
    area_name: string;
    // show_type: string;
    // logo_type: string;
    // logo_name: string;
    // logo_image_url: string;
    // text_carousel_timer: number;
    // slides_timer: number;
    // opdinfo_pollingtimer: number;
    // roomlist_show_timer: number;
    // follow: string | null;
    // domain_name: string;
    // del_flag: string;
}

export interface get_area_detail {
    area_id: string;
}
export interface area_detail_obj {
    area_id: string;
    area_name: string;
    show_type: string;
    logo_image_url: string;
    text_carousel_timer: number;
    slides_timer: number;
    opdinfo_pollingtimer: number;
    roomlist_show_timer: number;
    follow: string | null;
}

