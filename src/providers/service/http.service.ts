import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from '@thisui';
import { ToastService } from '@thisui';

// for json格式接收
// ; charset=utf-8
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

// for text格式
const httpOptionsAes = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  //#region json
  httpGet(url: string): Observable<any> {
    return this.http.get<any>(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError(url))
    );
  }
  httpPost(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError(url))
    );
  }
  private extractData(res: any) {
    return res;
  }
  //#endregion

  //#region text
  httpPost__decrypt(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data, httpOptionsAes).pipe(
      map(this.extractData_text),
      catchError(this.handleError(url))
    );
  }
  private extractData_text(res: any) {
    const body = JSON.parse(res);
    return body || {};
  }
  //#endregion

  // catch error
  private handleError<T>(operation: any) {
    return (error: any): Observable<any> => {
      this.loadingService.CloseLoading();
      this.toastService.presentToastWithOptions(`${error.statusText} ${operation}`, { duration: 3000 });
      const result = { success: 'F', message: error.message };
      return of(result);
    };
  }
}
