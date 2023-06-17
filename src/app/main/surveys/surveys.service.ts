import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn : 'root'})
export class SurveyService {
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  allowedEx: any[] = ['.jpg', '.jpeg', '.png'];
  allCategories:any [] = null;

  allVoices:any[] =[];

  constructor(private _httpClient: HttpClient) {
    this.loadVoices();
  }

  loadVoices() {
    this.getAllVoices().subscribe(
      res => {
        if(!res.error) {
          this.allVoices = res.body;
        }
      }
    )
  }

  getAllSurveys(): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getAllSurveys`);
  }

  getSurvey(id): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getSurveyDetails/${id}`);
  }

  addQuestion(data): Observable<any> {
    // {survey_id,question,question_type("boolean","number", "voice", "option")}
    return this._httpClient.post(`${environment.baseApiUrl}addQuestion`, data);
  }

  activateSurvey(data): Observable<any> {
    // {id}
    return this._httpClient.post(`${environment.baseApiUrl}activateSurvey`, data);
  }


  addSurvey(data): Observable<any> {
    // {name,description}
    return this._httpClient.post(`${environment.baseApiUrl}addSurvey`, data);
  }


  deleteQuestion(data): Observable<any> {
    // {id}
    return this._httpClient.post(`${environment.baseApiUrl}deleteQuestion`, data);
  }

  deleteSurvey(data): Observable<any> {
    // {id}
    return this._httpClient.post(`${environment.baseApiUrl}deleteSurvey`, data);
  }

  updateSurveyVoice(data): Observable<any> {
    // {id, voice}
    return this._httpClient.post(`${environment.baseApiUrl}updateSurveyVoice`, data);
  }

  getAllVoices(): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getAllVoices`);
  }



}
