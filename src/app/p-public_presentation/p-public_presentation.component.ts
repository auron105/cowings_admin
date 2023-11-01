import { ChangeDetectorRef, Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  FuncService, AlertService, ToastService, NavigateService
} from '@thisui';

import { AppService } from '../../providers/app.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-p-public_presentation',
  templateUrl: './p-public_presentation.component.html',
  styleUrls: ['./p-public_presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PPublicPresentationComponent implements OnInit {

  constructor(
    private funcService: FuncService,
    private alertService: AlertService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigateService: NavigateService,
    public appService: AppService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.listenForEvents();
    // this.form_item_init();
  }

  listenForEvents() {
    window.addEventListener('p-public_presentation:detectChanges', () => {
      this.changeDetectorRef.detectChanges();
    });

    window.addEventListener('p-public_presentation:change_area_id', async () => {
      this.reset_data();
      this.area_id = this.appService.pupr_useitem;
      await this.get_area_setting();
      this.form_item_init();
      this.changeDetectorRef.detectChanges();
    });
  }
  reset_data() {
    this.Form.reset();
    this.area_id = '';
    this.area_detail = {};

    this.Form_yt.reset();
    this.yt_list = [];

    this.Form_carousel.reset();
    this.carousel_list = [];

    this.Form_logo.reset();
    this.logo_url = '';
    this.prefile = undefined;
    this.slide_list = []
    this.slide_prefile = undefined;
  }
  form_item_init() {
    for (const key in this.area_detail) {
      let item = this.area_detail[key];

      if (this.Form.controls[key]) {
        this.Form.controls[key].setValue(item);

        if (key === 'area_id') {
          const _area_id = this.Form.controls[key].value;
          if (_area_id === '0001') {
            this.Form.controls['follow'].disable();
          } else {
            this.Form.controls['follow'].enable();
          }
        }

      } else {
        continue;
      }
    }

    for (const key in this.yt_list) {
      let item = this.yt_list[key];

      if (this.Form_yt.controls[key]) {
        this.Form_yt.controls[key].setValue(item);
      } else {
        continue;
      }
    }
  }

  //#region 區域設定
  Form: any = this.formBuilder.group({
    area_id: [''],
    area_name: ['', [Validators.required, Validators.maxLength(20)]],
    follow: [''],
    show_type: ['youtube', [Validators.required]],
    room_str: ['', [Validators.pattern(/^[0-9a-zA-Z,]+$/)]],
    roomlist_show_timer: [10000, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    opdinfo_pollingtimer: [10000, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    text_carousel_timer: [10000, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    slides_timer: [10000, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
  });
  area_id: string = '';
  area_detail: any = {};

  async get_area_setting() {
    const data_import = {
      area_id: this.area_id
    };

    // Create an array of promises for all the asynchronous operations
    const promises = [
      this.appService.get_area_detail(data_import, { rsa: false }),
      this.appService.youtube_list(data_import, { rsa: false }),
      this.appService.carousel_list(data_import, { rsa: false }),
      this.appService.slides_list(data_import, { rsa: false })
    ];

    try {
      // Use Promise.all to wait for all promises to resolve
      const [areaid_detail_res, yt_res, carousel_res, slide_res] = await Promise.all(promises);

      this.area_detail = areaid_detail_res[0] || {};

      if (this.area_detail.logo_image_url) {
        this.logo_url = this.appService.originurl + '/pupr_ctrl/uploads/' + this.area_detail.logo_image_url;
      }

      this.yt_list = yt_res[0] || {};
      this.carousel_list = carousel_res || [];

      //動態新增control
      for (let i = 0; i < this.carousel_list.length; i++) {
        this.Form_carousel.addControl('text_desc_' + i, new FormControl('', [Validators.maxLength(30)]));
      }

      this.slide_list = slide_res || [];
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
    }
  }
  basic_canSubmit() {
    let res = false;

    if (!this.Form.valid) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }
  async basic_submit() {
    const options = {
      color: '#F4511E',
      buttonarray: ['取消', '存檔']
    }
    const alert_res = await this.alertService.presentAlertConfirm("存檔區域設定", "確定是否存檔區域設定?", options);
    if (alert_res === 0) return;

    const Arr = this.funcService.replaceNullWithRp(this.Form.getRawValue(), '')
    const res = await this.appService.area_detail_update(Arr, { rsa: false });
    if (res) {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(res);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();
      this.changeDetectorRef.detectChanges();
    }
  }
  //#endregion

  Form_yt: any = this.formBuilder.group({
    area_id: [''],
    video_id: ['', [Validators.required]],
    playlist_id: ['']
  });
  yt_list: any = [];

  yt_canSubmit() {
    let res = false;

    if (!this.Form_yt.valid) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }
  async yt_submit() {
    const options = {
      color: '#F4511E',
      buttonarray: ['取消', '存檔']
    }
    const alert_res = await this.alertService.presentAlertConfirm("存檔youtube設定", "確定是否存檔youtube設定?", options);
    if (alert_res === 0) return;

    const Arr = this.Form_yt.getRawValue();
    Arr['area_id'] = this.area_id;

    const res = await this.appService.youtube_list_update(Arr, { rsa: false });
    if (res) {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(res);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();
      this.changeDetectorRef.detectChanges();
    }
  }

  Form_carousel: any = this.formBuilder.group({});
  carousel_list: any = [];

  carousel_canSubmit() {
    let res = false;

    if (!this.Form_carousel.valid) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }
  async carousel_submit() {
    const options = {
      color: '#F4511E',
      buttonarray: ['取消', '存檔']
    }
    const alert_res = await this.alertService.presentAlertConfirm("存檔跑馬燈內容", "確定是否存檔存檔跑馬燈內容?", options);
    if (alert_res === 0) return;

    const Arr = this.Form_carousel.getRawValue();

    Object.keys(Arr).forEach(key => {
      const textId = key.split('_')[2];
      if (this.carousel_list[textId]) {
        this.carousel_list[textId].text_desc = Arr[key];
      }
    });

    const data_import = {
      object: this.carousel_list
    }

    const res = await this.appService.carousel_list_update(data_import, { rsa: false });
    if (res) {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(res);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();
      this.changeDetectorRef.detectChanges();
    }
  }

  Form_logo: any = this.formBuilder.group({
    area_id: ['', [Validators.required]],
    logo_img: ['', [Validators.required]],
  });
  logo_url: string = '';
  prefile: any;

  logo_canSubmit() {
    let res = true;

    if (this.prefile && this.prefile.length > 0) {
      res = false;
    }

    return res;
  }
  onFileChange(e: any) {
    const is_type = e.target.files[0].type;
    const is_size = e.target.files[0].size;

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(is_type)) {
      this.toastService.presentToastWithOptions(`不支援的格式類型`, { duration: 3000, buttontext: 'OK' });
      return;
    }

    if (is_size > (1048576 * 3)) {
      this.toastService.presentToastWithOptions(`圖片大小不可大於3MB`, { duration: 3000, buttontext: 'OK' });
      return;
    }

    if (e.target.files.length > 0) {
      this.prefile = e.target.files;
    }
  }
  logo_image_upload() {
    let _file;
    if (this.prefile && this.prefile.length > 0) {
      _file = this.prefile[0];
    } else {
      const option = {
        duration: 3000,
        buttontext: 'OK',
      }
      this.toastService.presentToastWithOptions(`沒有選擇圖片`, option);
      return;
    }

    const formData = new FormData();
    formData.append('hosp', this.appService.hosp);
    formData.append('area_id', this.area_id);
    formData.append('file', _file);
    this.httpClient.post(this.appService.baseurl + 'logo_upload', formData).subscribe(async (event: any) => {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(event.object);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }
      
      this.logo_url = '';
      this.changeDetectorRef.detectChanges();

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();

      setTimeout(() => {
        this.changeDetectorRef.detectChanges();
      }, 500);
    });
  }

  slide_list: any = [];
  slide_prefile: any;

  slide_canSubmit() {
    let res = true;

    if (this.slide_prefile && this.slide_prefile.length > 0) {
      res = false;
    }

    return res;
  }
  slide_onFileChange(e: any) {
    const is_type = e.target.files[0].type;
    const is_size = e.target.files[0].size;

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(is_type)) {
      this.toastService.presentToastWithOptions(`不支援的格式類型`, { duration: 3000, buttontext: 'OK' });
      return;
    }

    if (is_size > (1048576 * 3)) {
      this.toastService.presentToastWithOptions(`圖片大小不可大於3MB`, { duration: 3000, buttontext: 'OK' });
      return;
    }

    if (e.target.files.length > 0) {
      this.slide_prefile = e.target.files;
    }
  }
  slide_image_upload() {
    let _file;
    if (this.slide_prefile && this.slide_prefile.length > 0) {
      _file = this.slide_prefile[0];
    } else {
      const option = {
        duration: 3000,
        buttontext: 'OK',
      }
      this.toastService.presentToastWithOptions(`沒有選擇圖片`, option);
      return;
    }

    const formData = new FormData();
    formData.append('hosp', this.appService.hosp);
    formData.append('area_id', this.area_id);
    formData.append('file', _file);
    this.httpClient.post(this.appService.baseurl + 'slide_upload', formData).subscribe(async (event: any) => {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(event.object);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();
      this.changeDetectorRef.detectChanges();
    });
  }

  async slides_list_delete(slide_id: string) {
    const options = {
      color: '#F4511E',
      buttonarray: ['取消', '刪除']
    }
    const alert_res = await this.alertService.presentAlertConfirm("刪除幻燈片", "確定是否刪除幻燈片?", options);
    if (alert_res === 0) return;

    const data_import = {
      area_id: this.area_id,
      slide_id: slide_id.toString()
    }
    const res = await this.appService.slides_list_delete(data_import, { rsa: false });
    if (res) {
      const ElementGreaterThanZero = this.appService.mssql_rowaffect(res);

      let chk_msg = '更新成功';
      if (!ElementGreaterThanZero) {
        chk_msg = '更新失敗';
      }

      await this.alertService.presentAlertWithOptions('', chk_msg);
      await this.get_area_setting();
      this.changeDetectorRef.detectChanges();
    }
  }
}
