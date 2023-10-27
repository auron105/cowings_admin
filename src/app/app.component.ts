import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FuncService, NavigateService, UserStorageService } from '@thisui';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppService } from '../providers/app.service';
import { copyright, version } from '../providers/version';
import { environment } from '../environments/environment';

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
    public mediaMatcher: MediaMatcher,
    public appService: AppService,
    private userStorageService: UserStorageService,
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
      this.appService.originurl = 'http://localhost:8080';
      this.appService.baseurl = this.appService.originurl + '/pupr_ctrl/cowings_admin/';
    } else if (production) {
      this.devMode = false;
      this.appService.originurl = 'http://localhost:8080';
      this.appService.baseurl = this.appService.originurl + '/pupr_ctrl/cowings_admin/';
    }

    //#region reload的時候，自動路由
    // let path = this.navigateService.path();
    // path = (path === '/') ? '/public_presentation/0001' : path;
    // this.selectedurl = this.navigateService.urlparam(path, 2);

    // const list_item: list | undefined = this.list.find((item) => item.value === this.selectedurl);
    // this.selecteditem = (list_item) ? list_item.name : '';
    // this.sidelist = this.list.filter((item: any) => item.value === this.selectedurl)[0]['item'];

    // const path2 = this.navigateService.urlparam(path, 3);
    // const path3 = this.list.find((item) => item.value === this.selectedurl);
    // if (path3) {
    //   const path4 = path3.item.find((item) => item.value === path2);
    //   setTimeout(() => {
    //     this.change_action_item2(path4 || { name: '', value: '' });
    //     this.changeDetectorRef.detectChanges();
    //   }, 100);
    // }
    //#endregion
  }

  // 第一層網址參數
  async change_action_item(select: sys_list) {
    this.appService.selectedurl = select.value.toLowerCase();
    this.selecteditem = select.name;

    // 載入區域清單
    const data_import = {
      sys_id: this.appService.selectedurl
    };
    const areaid_list_res = await this.appService.get_areaid_list(data_import, { rsa: false });
    this.appService.areaid_list = areaid_list_res;

    this.navigateService.navigation(select.value.toLowerCase());
    this.sidelist = this.appService.areaid_list;
    const path = this.sidelist[0];
    this.changeDetectorRef.detectChanges();
    this.change_action_item2(path);
  }

  // 第二層網址參數
  change_action_item2(select: areaid_list_obj) {
    this.navigateService.navigation(this.appService.selectedurl + '/' + select.area_id);
    this.selecteditemtiem = select.area_name;
    this.appService.pupr_useitem = select.area_id;
    
    window.dispatchEvent(new CustomEvent(`p-public_presentation:change_area_id`));
  }
}
