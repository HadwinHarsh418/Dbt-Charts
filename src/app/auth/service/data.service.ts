import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { InterceptorSkipHeader } from 'app/auth/helpers/jwt.interceptor';
import { DeviceDetectorService } from 'ngx-device-detector';

export interface Person {
  id: string;
  isActive: boolean;
  age: number;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  geodata: any = null;
  devicedata: any = null;
  transactionPriorityArray: any = [
    'Cashout', 'Deposit', 'Bonus'
  ]
  paymentTypePriority: any = ['EURO', 'BTC'];
  public openModal = new BehaviorSubject<boolean>(false);
  public refreshList = new BehaviorSubject<boolean>(false);

  public openwithdrawal = new BehaviorSubject<boolean>(false);
  public opentIdentificaitonModal = new BehaviorSubject<any>(false);
  public openDeposit = new BehaviorSubject<any>(false);
  minimumAmount: any = { id: 1, min_deposit: 5, min_property_Invest: 88, min_tick_Invest: 0.1, min_withdrawl: 0, first_autoplay_invest: 44, autoplay_invest: 88, max_deposit: 144000, daily_withdrawal: 20000, vip_daily_withdrawal: 100000, min_tick_Invest_inbithome: 1 };
  cpUserData: any = "eyJ1ZXJuYW1lIjoic2l4cHJvZml0ZGV2IiwidXNlcm5hbWUiOiJzaXhwcm9maXRkZXYiLCJtZXJjaGFudF9pZCI6ImU1OGRlZWNiM2ViMzk1MmViMDhiYjViYTU3YmY1NmUyIiwiZW1haWwiOiJwcm9jcnlwdG9sZWFkZXJAZ21haWwuY29tIiwicHVibGljX25hbWUiOiJCSVRPTUFUSUMiLCJ0aW1lX2pvaW5lZCI6MTU3MzY2MDY2MX0=";


  constructor(private http: HttpClient, 
    private deviceService: DeviceDetectorService,
    ) { }

  getIp() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://jsonip.com');
  }

  getGeoData() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://geolocation-db.com/json/');
  }

  loginLog(input_data) {
    return this.http.post(environment.baseApiUrl + 'loginLog/?lang=en', input_data)
  }

  getLoginLogs(id) {
    return this.http.get(`${environment.baseApiUrl}loginLogHistory/${id}`);

  }

  getAllUsers(searchStr = ''): Observable<any> { 
    return this.http.get(`${environment.baseApiUrl}getAllUsers?searchStr=${searchStr}`);
  }

  getAllDriver(searchStr = ''): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAllDriver?searchStr=${searchStr}`);
  }

  getBookingList(searchStr = '') : Observable<any> {
    return this.http.get(`${environment.baseApiUrl}bookingListing`);
  }

  sortFtransactions(transactions) {
    let ot = transactions;
    // ot = ot.sort((a, b) => {
    //   return this.transactionPriorityArray.indexOf(a.order_type)
    //     - this.transactionPriorityArray.indexOf(b.order_type)
    // });
    // ot = ot.sort((a, b) => {
    //   if (a.payment_type && b.payment_type) {
    //     return this.paymentTypePriority.indexOf(a.payment_type)
    //       - this.paymentTypePriority.indexOf(b.payment_type)
    //   } else return 1;
    // });
    ot = ot.sort((a, b) => {
      let acd = this.changeDatetoTime(a.created_at)
      let bcd = this.changeDatetoTime(b.created_at)
      return bcd - acd
    });
    return ot;
  }

  changeDatetoTime(crdt) {
    return new Date(crdt.replace('T', ' ').replace('.000Z', '').replace(/-/g, '/') + '').getTime();
  }
  
  reqforAntiCode(input_data) {
    return this.http.post(`${environment.baseApiUrl}reqforAntiCode`,input_data);
  }


  getGeoDevData() {
    this.getGeoData().subscribe(
      res => {
        this.geodata = res;
      }, error => {

      }
    );
  }

  getDeviceData() {
    this.devicedata = this.deviceService.getDeviceInfo();
    sessionStorage.setItem("device_type", this.devicedata['os']);
  }

  getgeoDevObject() {
    let locData:any = { };
    if(this.geodata) {
      locData.geoData = this.geodata;
      locData.ip_address = this.geodata.IPv4 ? this.geodata.IPv4 : 
                           this.geodata.IPv6 ? this.geodata.IPv6 : '';
      locData.area =  this.geodata.city ?  this.geodata.city 
                      : this.geodata.country ? this.geodata.country : '';
    }

    if(this.devicedata) {
      locData.deviceData = this.devicedata;
      locData.platform =  this.devicedata.browser;
      locData.device =  this.devicedata.os;
    }

    return locData;
  }

}
