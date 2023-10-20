import { Injectable } from "@angular/core";
import { publickey } from "./publickey";
import {
    RequestService,
    rs_options,
    AlertService,
    LoadingService
} from '@thisui';
import {
    sys_list,
    get_areaid_list,
    areaid_list_obj,
    get_area_detail,
    area_detail_obj
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

    selectedurl = '';

    originurl: string = '';
    baseurl: string = 'http://localhost:8080/pupr_ctrl/';

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
    //#endregion
}
