import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { AppService } from '../../providers/app.service';


export interface rs_options {
  rsa: boolean;
  publickey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public appService: any;

  constructor(
    private httpServ: HttpService,
    private injector: Injector,
  ) { }

  /**
   * 發送 request
   * @param url request url
   * @param req_json 帶入參數
   * @param req_type POST or GET
   * @param options.rsa 是否加密內容
   * @param options.publickey options.rsa是true 則必須要提供pkey
   * @returns
   * @example
   * let options = {
      rsa: false,
      publickey: '',
    }
   * let req_json = {
      emr_type: '',
      sdate: '',
      edate: ''
     };
   *  let res_json = await this.requestService.RequestService(this.userData.baseurl + 'emr_list', req_json, 'POST', options);
   */
  async RequestService(url: string, req_json: any, req_type = 'POST', options: rs_options): Promise<any> {
    return new Promise(async (res) => {

      const Options = {
        rsa: options.rsa,
        publickey: options.publickey || '',
      }

      if (Options.rsa) {
        if (!Options.publickey) {
          res({ success: 'N', message: 'rsa enbale, need publickey' });
        }
      }

      let req_json_import: any;
      if (Options.rsa) {
        // 思考做法
        // const enc_obj = this.cryptoService.publicEncryptRSA(Options.publickey, JSON.stringify(req_json));
        // if (!enc_obj.success) {
        //   res({ success: 'N', message: enc_obj.message });
        // }

        // req_json_import = enc_obj.encode;

      } else {
        req_json_import = req_json;
      }

      //注入ebook service
      this.getAppService();
      req_json_import.hosp = this.appService.hosp;
      
      if (req_type === 'POST') {
        this.httpServ.httpPost(url, req_json_import).subscribe(async res2 => {
          if (res2.success === 'F') return;
          res(res2);
        });
      } else
        if (req_type === 'GET') {
          this.httpServ.httpGet(url).subscribe(res2 => {
            if (res2.success === 'F') return;
            res(res2);
          });
        }
    });
  }
  // 在需要使用ebookService時再載入
  private getAppService() {
    if (!this.appService) {
      this.appService = this.injector.get(AppService);
    }
  }
}
