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
}

export interface get_area_detail {
    area_id: string;
}
export interface area_detail_obj {
    area_id: string;
    area_name: string;
    show_type: string;
    room_str: string;
    logo_image_url: string;
    text_carousel_timer: number;
    slides_timer: number;
    opdinfo_pollingtimer: number;
    roomlist_show_timer: number;
    follow: string | null;
}

export interface area_detail_update {
    area_id: string;
    show_type: string;
    logo_image_url: string;
    text_carousel_timer: number;
    slides_timer: number;
    opdinfo_pollingtimer: number;
    roomlist_show_timer: number;
    follow: string;
}

export interface youtube_list {
    area_id: string;
}
export interface youtube_list_obj {
    video_id: string;
    playlist_id: string;
}

export interface youtube_list_update {
    area_id: string;
    video_id: string;
    playlist_id: string;
}

export interface carousel_list {
    area_id: string;
}
export interface carousel_list_obj {
    area_id: string;
    text_id: string;
    text_desc: string;
}

export interface carousel_list_update {
    area_id: string;
    text_id: string;
    text_desc: string;
}

export interface slides_list {
    area_id: string;
}
export interface slides_list_obj {
    slide_id: string;
    area_id: string;
    slide_img_url: string;
}
export interface slides_list_delete {
    area_id: string;
    slide_id: string;
}