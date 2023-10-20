import { ChangeDetectorRef, Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import {
  FuncService, AlertService, ToastService, NavigateService
} from '@thisui';

import { AppService } from '../../providers/app.service';

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
      this.area_id = this.appService.pupr_useitem;
      await this.get_area_setting();
      this.form_item_init();
      this.changeDetectorRef.detectChanges();
    });
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
  }

  Form: any = this.formBuilder.group({
    area_id: [''],
    area_name: ['', [Validators.required, Validators.maxLength(20)]],
    follow: [''],
    show_type: ['youtube', [Validators.required]],
    roomlist_show_timer: ['10000', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    opdinfo_pollingtimer: ['10000', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    text_carousel_timer: ['10000', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
    slides_timer: ['15000', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(5)]],
  });

  area_id: string = '';
  area_detail: any = {};

  async get_area_setting() {
    const data_import = {
      area_id: this.area_id
    };
    const areaid_detail_res = await this.appService.get_area_detail(data_import, { rsa: false });
    this.area_detail = areaid_detail_res[0] || {};
  }

  canSubmit() {
    let res = false;

    if (!this.Form.valid) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }
  
  async submit() {
    const tpmiArr = this.Form.getRawValue();
    tpmiArr['hosp_code_key'] = tpmiArr['hosp_code'];
    tpmiArr['hosp_code_arg'] = tpmiArr['hosp_code'];
    tpmiArr['atcm_license_flag'] = (tpmiArr['atcm_license_flag'])? 'Y' : 'N';

    const res = await this.maintainService.maintain_hosp_basic_set_data(tpmiArr);
    if (!res) return false;
    
    await this.alertService.presentAlertWithOptions('', '更新成功');
    this.back();
  }
}
