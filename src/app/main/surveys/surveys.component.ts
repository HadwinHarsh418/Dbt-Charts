import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SurveyService } from './surveys.service';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {
  @ViewChild('addSurveyModal') addSurveyModal: ElementRef<any>;
  @ViewChild('deleteSurveyModal') deleteSurveyModal: ElementRef<any>;

  page = new Page();
  allData:any = [];
  addSurveyForm: FormGroup;
  addingSurvey:boolean;
  rows = []
  currentUser:User;
  subAll :any[] =[];
  deletingSurvey:boolean;
  toDelete:any = null;
  allVoice: any[]= [];
  constructor(
    private _authService: AuthenticationService,
    private _surveyService: SurveyService,
    private toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.subAll.push( 
      this._authService.currentUser.subscribe(
        x => { this.currentUser = x } 
      )
    );
    this.addSurveyForm = this.formBuilder.group({
      id: [''],
      description: ['', Validators.required],
      voice: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllSurveys();
    this.getAllVoices();
  }

  getAllSurveys() {
    this._surveyService.getAllSurveys().subscribe(
      res => {
        if(!res.error) {
          this.allData = res.body;
          this.filterData();
        } else { 
          this._authService.errorToaster(res);
        }
      }, error => {
        this.toastr.errorToastr('Something went wrong while fetching surveys, please try again later.');
      }
    )
  }

  filterData() {
    if(this.allData && this.allData.length) {
      this.rows = this.allData;
    } else {
      this.allData = [];
    }
  }

  getAllVoices() {
    if(!this._surveyService.allVoices || !this._surveyService.allVoices.length) {
      this._surveyService.getAllVoices().subscribe(
        res => {
          if(!res.error) {
            this._surveyService.allVoices = res.body;
            this.allVoice = this._surveyService.allVoices;
          }
        }
      );
    } else {
      this.allVoice = this._surveyService.allVoices;
    }
  }

  get surveyForm() {
    return this.addSurveyForm.controls;
  }

  addSurvey(modal) {
    for (const key in this.addSurveyForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.addSurveyForm.controls, key)) {
        this.addSurveyForm.controls[key].markAsDirty();
      }
    }
    if(this.addSurveyForm.invalid) {
      return;
    }
    let data = this.addSurveyForm.value;
    this.addingSurvey = true;
    this._surveyService.addSurvey(data).subscribe(
      res => {
        if(!res.error) {
          this.closed(modal)
          this.getAllSurveys();
          this.toastr.successToastr(res.msg);
        } else {
          this._authService.errorToaster(res);
        }
        this.addingSurvey = false;
      }, error => {
        this.addingSurvey = false;
        this.toastr.errorToastr('Something went wrong while adding survey, please try again later');
      }
    );
    
  }

  deleteSurvey(modal) {
    this.deletingSurvey = true;
    this._surveyService.activateSurvey({id: this.toDelete.survey_id}).subscribe(
      res => {
        if(!res.error) {
          this.closed(modal)
          this.getAllSurveys();
          this.toastr.successToastr(res.msg);
        } else {
          this._authService.errorToaster(res);
        }
        this.deletingSurvey = false;
      }, error => {
        this.deletingSurvey = false;
        this.toastr.errorToastr('Something went wrong while activating this survey, please try again later');
      }
    );
  }

  openSurveyModal() {
    this.addSurveyForm.reset();
    this.modalOpenOSE(this.addSurveyModal, 'sm');
  }
  openDeleteModal(survey= null) {
    if(survey) {
      this.toDelete = survey
      this.modalOpenOSE(this.deleteSurveyModal, 'lg');
    }
  }


  modalOpenOSE(modalOSE, size = 'sm') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }

}
