import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User, UserProfileData } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  currntUserDetails: UserProfileData;
  constructor(private _http: HttpClient) {
    this.setUserData();
  }

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Get user by id
   */
  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  getUserDetails(enc_user_id: string) {
    return this._http.get<any>(`${environment.baseApiUrl}getUser/${enc_user_id}`);
  }

  updateUserDetails(encData: any) {
    return this._http.post<any>(`${environment.baseApiUrl}updatePersonalInfo`, encData);
  }

  verfifyDocument(encData: any) {
    return this._http.post<any>(`${environment.baseApiUrl}verfifyDocument`, encData);
  }

  changePassword(encData: any) {
    return this._http.post<any>(`${environment.baseApiUrl}changePassword`, encData);
  }

  gettwoFactAuthEnable(encData: any) {
    return this._http.put<any>(`${environment.baseApiUrl}twoFactAuthEnable`, encData);
  }

  twoFactAuthVerify(encData: any) {
    // {user_id,srcode} as enc
    return this._http.post<any>(`${environment.baseApiUrl}twoFactAuthVerify`, encData);
  }

  chaneAntiPhisingCode(encData: any) {
    // {user_id,srcode} as enc
    return this._http.post<any>(`${environment.baseApiUrl}chaneAntiPhisingCode`, encData);
  }

  twoFactAuthDisable(encData: any) {
    // {user_id,srcode} as enc
    return this._http.post<any>(`${environment.baseApiUrl}twoFactAuthDisable`, encData);
  }

  uploadProfilePic(formData): Observable<any> {
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.append('Content-Type', undefined);
    return this._http.post(`${environment.baseApiUrl}uploadProfilePic/`, formData)

  }

  identification_file(formData): any {
    let headers = new HttpHeaders();
    headers.append('Content-Type', undefined);
    return this._http.post(`${environment.baseApiUrl}identification`, formData)
  }
  getCurrentAntiCode(enc): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}getCurrentAntiCode/${enc}`,)
  }

  setUserData(data?: any) {
    if (data) {
      this.currntUserDetails.address = (data.address) ? data.address : this.currntUserDetails.address ? this.currntUserDetails.address : '';
      this.currntUserDetails.full_name = (data.full_name) ? data.full_name : this.currntUserDetails.full_name ? this.currntUserDetails.full_name : '';
      this.currntUserDetails.id_passport = (data.id_passport) ? data.id_passport : this.currntUserDetails.id_passport ? this.currntUserDetails.id_passport : '';
      this.currntUserDetails.is_company = (data.is_company) ? data.is_company : this.currntUserDetails.is_company ? this.currntUserDetails.is_company : 0;
      this.currntUserDetails.company_name = (data.company_name) ? data.company_name : this.currntUserDetails.company_name ? this.currntUserDetails.company_name : '';
      this.currntUserDetails.avoid_retention = (data.avoid_retention) ? data.avoid_retention : this.currntUserDetails.avoid_retention ? this.currntUserDetails.avoid_retention : 0;
      this.currntUserDetails.city = (data.city) ? data.city : this.currntUserDetails.city ? this.currntUserDetails.city : '';
      this.currntUserDetails.company_id = (data.company_id) ? data.company_id : this.currntUserDetails.company_id ? this.currntUserDetails.company_id : '';
      this.currntUserDetails.country = (data.country) ? data.country : this.currntUserDetails.country ? this.currntUserDetails.country : '';
      this.currntUserDetails.date_of_birth = (data.date_of_birth) ? this.fixDateFormat(data.date_of_birth) : this.currntUserDetails.date_of_birth ? this.fixDateFormat(this.currntUserDetails.date_of_birth) : '';
      this.currntUserDetails.lang_pref = (data.lang_pref) ? data.lang_pref : this.currntUserDetails.lang_pref ? this.currntUserDetails.lang_pref : '';
      this.currntUserDetails.phone = (data.phone) ? data.phone : this.currntUserDetails.phone ? this.currntUserDetails.phone : '';
      this.currntUserDetails.postcode = (data.postcode) ? data.postcode : this.currntUserDetails.postcode ? this.currntUserDetails.postcode : '';
      this.currntUserDetails.profile_picture = (data.profile_picture) ? data.profile_picture : this.currntUserDetails.profile_picture ? this.currntUserDetails.profile_picture : '';
    } else {
      this.currntUserDetails = {
        address: '',
        avoid_retention: 0,
        city: '',
        company_id: null,
        company_name: null,
        country: '',
        date_of_birth: '',
        full_name: '',
        id_passport: '',
        is_company: 0,
        lang_pref: '',
        phone: '',
        postcode: '',
        profile_picture: '',
      }
    }
  }

  fixDateFormat(dateString: any) {
    // "1988-08-23T00:00:00.000Z"
    return dateString ? dateString.replace('T', ' ').replace('.000Z', '') : dateString;
  }
}
