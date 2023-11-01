import { Injectable } from "@angular/core";
import { publickey } from "./publickey";
import { RequestService } from "../providers/service/request.service";
import {
    // RequestService,
    rs_options,
    AlertService,
    LoadingService
} from '@thisui';
import {
    sys_list,
    get_areaid_list,
    areaid_list_obj,
    get_area_detail,
    area_detail_obj,
    area_detail_update,
    youtube_list,
    youtube_list_obj,
    youtube_list_update,
    carousel_list,
    carousel_list_obj,
    carousel_list_update,
    slides_list,
    slides_list_obj,
    slides_list_delete
} from './app.interface';

@Injectable({
    providedIn: "root",
})
export class AppService {

    constructor(
        private requestService: RequestService,
        private alertService: AlertService,
        private loadingService: LoadingService,
    ) { }

    hosp = '';
    selectedurl = '';

    originurl: string = '';
    baseurl: string = '';

    sys_list: sys_list[] = [
        {
            name: '公播平台',
            value: 'public_presentation'
        }
    ];

    //#region 公播平台管理系統-發送需求
    pupr_useitem = '';
    areaid_list: areaid_list_obj[] = [];
    show_type_list = [
        {
            name: 'slides',
            value: 'slides'
        },
        {
            name: 'youtube',
            value: 'youtube'
        }
    ];

    
    // 新增區域代碼清單
    async add_areaid_list(options: rs_options): Promise<Array<number>> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'add_areaid_list', {}, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }
    // 取得區域代碼清單
    async get_areaid_list(data_import: get_areaid_list, options: rs_options): Promise<areaid_list_obj[]> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'get_areaid_list', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }

    // 取得區域資料
    async get_area_detail(data_import: get_area_detail, options: rs_options): Promise<area_detail_obj[]> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'areaid_detail', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }
    // 更新區域資料
    async area_detail_update(data_import: area_detail_update, options: rs_options): Promise<Array<number>> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'areaid_detail_update', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }

    //youtube資料
    async youtube_list(data_import: youtube_list, options: rs_options): Promise<youtube_list_obj[]> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'youtube_list', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }
    async youtube_list_update(data_import: youtube_list_update, options: rs_options): Promise<Array<number>> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'youtube_list_update', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }

    //跑馬燈資料
    async carousel_list(data_import: carousel_list, options: rs_options): Promise<carousel_list_obj[]> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'carousel_list', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }
    async carousel_list_update(data_import: carousel_list_update, options: rs_options): Promise<Array<number>> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'carousel_list_update', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }

    //幻燈片清單
    async slides_list(data_import: slides_list, options: rs_options): Promise<slides_list_obj[]> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'slides_list', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }
    async slides_list_delete(data_import: slides_list_delete, options: rs_options): Promise<Array<number>> {
        if (options.rsa) options.publickey = publickey;

        this.loadingService.OpenLoading();
        const res = await this.requestService.RequestService(this.baseurl + 'slides_list_delete', data_import, 'POST', options);
        this.loadingService.CloseLoading();
        if (res.success !== 'Y') {
            this.alertService.presentAlertWithOptions('錯誤?', res.message);
            throw new Error('錯誤? ' + res.message);
        }
        return res.object;
    }


    //#endregion

    mssql_rowaffect(res: any) {
        return res.some((element: any, index: number) => {
            return index === res.length - 1 && element > 0;
        });
    }
}
