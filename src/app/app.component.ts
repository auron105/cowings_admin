import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FuncService, NavigateService, AlertService } from '@thisui';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppService } from '../providers/app.service';
import { copyright, version } from '../providers/version';
import { environment } from '../environments/environment';
import { DevOriginUrl, OriginUrl, UrlParam } from '../providers/BaseUrl';

import { areaid_list_obj, sys_list } from '../providers/app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {
  Copyright = copyright;
  Version = version;

  devMode = true;

  mobileQuery: any;

  selecteditem = '';
  sidelist: areaid_list_obj[] = [];
  selecteditemtiem = '';

  constructor(
    public funcService: FuncService,
    private navigateService: NavigateService,
    private alertService: AlertService,
    public mediaMatcher: MediaMatcher,
    public appService: AppService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 768px)');
  }
  async ngOnInit(): Promise<void> {
    //確認測試環境與正式環境
    const dev = environment.dev;
    const serve = environment.serve;
    const production = environment.production;

    if (dev || serve) {
      this.devMode = true;
      this.appService.originurl = DevOriginUrl;
      this.appService.baseurl = this.appService.originurl + UrlParam;
    } else if (production) {
      this.devMode = false;
      this.appService.originurl = OriginUrl;
      this.appService.baseurl = this.appService.originurl + UrlParam;
    }

    //#region reload的時候，自動路由
    let path = this.navigateService.path();
    this.appService.hosp = this.navigateService.urlparam(path, 2);
    let path1 = this.navigateService.urlparam(path, 3);
    let path2 = this.navigateService.urlparam(path, 4);
    const sys_name = this.appService.sys_list.filter((item) => item.value === path1);

    this.change_action_item({ name: (sys_name.length > 0) ? sys_name[0].name : path1, value: path1 }, path2)
    //#endregion
  }

  // 第一層網址參數
  async change_action_item(select: sys_list, path2?: string) {
    this.appService.selectedurl = select.value.toLowerCase();
    this.selecteditem = select.name;

    // 載入區域清單
    await this.get_areaid_list();

    let path2_arr: any = [];
    if (path2) {
      path2_arr = this.sidelist.filter((item) => item.area_id === path2);
    }

    const path = (path2_arr.length > 0) ? path2_arr[0] : this.sidelist[0];

    this.navigateService.navigation(this.appService.hosp + '/' + this.appService.selectedurl);

    this.changeDetectorRef.detectChanges();
    this.change_action_item2(path);
  }

  // 第二層網址參數
  change_action_item2(select: areaid_list_obj) {
    this.navigateService.navigation(this.appService.hosp + '/' + this.appService.selectedurl + '/' + select.area_id);
    this.selecteditemtiem = select.area_name;
    this.appService.pupr_useitem = select.area_id;

    window.dispatchEvent(new CustomEvent(`p-public_presentation:change_area_id`));
  }

  async get_areaid_list() {
    const data_import = {
      sys_id: this.appService.selectedurl
    };
    const areaid_list_res = await this.appService.get_areaid_list(data_import, { rsa: false });
    this.appService.areaid_list = areaid_list_res;
    this.sidelist = this.appService.areaid_list;
  }

  async open_add_area_dialog() {
    const options = {
      color: '#F4511E',
      buttonarray: ['Cancal', 'Add']
    }
    const alert_res = await this.alertService.presentAlertConfirm("新增區域?", "確認是否新增區域?", options);
    if (alert_res === 0) {
      return;
    }

    // 新增區域
    const add_areaid_list_res = await this.appService.add_areaid_list({ rsa: false });
    if (add_areaid_list_res) {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(add_areaid_list_res);

      let chk_msg = '新增成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '新增失敗';
      }

      this.get_areaid_list();
      await this.alertService.presentAlertWithOptions('', chk_msg);

      const area_obj = this.appService.areaid_list[this.appService.areaid_list.length - 1];
      this.change_action_item2({area_id: area_obj.area_id, area_name: ''});
    }
  }
}
