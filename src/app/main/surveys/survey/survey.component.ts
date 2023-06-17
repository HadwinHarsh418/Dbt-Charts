import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SurveyService } from '../surveys.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @ViewChild('addQuestionModal') addQuestionModal: ElementRef<any>;
  @ViewChild('deleteQuestionModal') deleteQuestionModal: ElementRef<any>;

  page = new Page();
  surveyData:any;
  addQuestionForm: FormGroup;
  addingQuestion:boolean;
  currentUser:User;
  subAll :any[] =[];
  allQuestions:any[] = [];
  allAnswers:any[] = [];
  questionText:any[] = [];
  filteredAnswers:any[] = [];
  deletingQuestion:boolean;
  toDelete:any = null;
  survey_id:any;
  loading: any;
  csvData: any[]= [];
  allVoice: any[] = [];
  voice_to_play:any = '';
  updatingVoice: boolean;
  constructor(
    private _authService: AuthenticationService,
    private _surveyService: SurveyService,
    private toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private route: Router,
  ) {
    this.subAll.push( 
      this._authService.currentUser.subscribe(
        x => { this.currentUser = x } 
      )
    );
    this.subAll.push( 
      this.activatedRoute.params.subscribe(
        param=> { 
          if(param.survey_id) {
            this.survey_id = param.survey_id;
            this.getSurvey()
          } else {
            this.route.navigate(['/surveys'])
          }
        } 
      )
    );
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

  updateVoice() {
    if(!this.voice_to_play) {
      this.toastr.errorToastr('Please select a voice for survey');
      return;
    }
    this.updatingVoice = true;
    let data = {id: this.surveyData.id, voice: this.voice_to_play}
    this._surveyService.updateSurveyVoice(data).subscribe(
      res => {
        if(!res.error) {
          this.surveyData.voice_to_play = this.voice_to_play;
          this.toastr.successToastr(res.msg);
        } else {
          this._authService.errorToaster(res);
        }
        this.updatingVoice = false
      }, error => {
        this.toastr.errorToastr('Oops! something went wrong while updating voice, please try again later.');
        this.updatingVoice = false
      }
    )
  }

  initQuestion() {
    this.addQuestionForm = this.formBuilder.group({
      question: ['', [Validators.required]],
      question_type: ['', [Validators.required]],
      options: this.formBuilder.array([])
    });
    this.addQuestionForm.get('question_type').valueChanges.subscribe(
      value => {
        if(value == 'option') {
          this.addOption();
        } else {
          for (const key in this.optionArray.controls) { 
            this.deleteOption(key, true);
          }
        }
      }
    )
  }

  ngOnInit(): void {
    this.getAllVoices();
  }

  get optionArray() {
      return this.addQuestionForm.get('options') as FormArray;
  }

  addOption() {
    this.optionArray.push(this.formBuilder.group({ key:['', Validators.required], title:['', Validators.required] }));
  }

  deleteOption(index, force=false) {
    if(this.optionArray.controls.length > 1) {
      this.optionArray.removeAt(index);
    } else if(force) {
      this.optionArray.removeAt(index);
    }
  }

  getSurvey() {
    this.loading = true;
    this._surveyService.getSurvey(this.survey_id).subscribe(
      res => {
        if(!res.error) {
          this.surveyData = res.body[0];
          this.voice_to_play = this.surveyData.voice_to_play;
          this.allQuestions = this.surveyData.questions ? this.surveyData.questions : []; 
          this.mapAnswers();
        } else { 
          this._authService.errorToaster(res);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        this.toastr.errorToastr('Something went wrong while fetching survey details, please try again later.');
      }
    )
  }

  mapAnswers() {
    let availableQuestions = [];
    let questionText = [];
    this.allQuestions.forEach(qsn => { availableQuestions.push(qsn.id); questionText.push(qsn.question)} );
    let allAnswers = this.surveyData.answers 
                      ? this.surveyData.answers.filter(anss => availableQuestions.includes(anss.question_id)) : [];
    let callers:any = [];
    let alans:any = [];
    allAnswers.forEach(ans => {
      if(!callers.includes(ans.phone)) {
        alans.push({
          phone: ans.phone+'' ,
          created_at: ans.created_at,
          survey_id: ans.survey_id,
          complete: ans.complete,
          customer_name: ans.customer_name || ans.phone+'',
          customer_id: ans.customer_id || '-'
        });
        let indx = alans.length - 1;
        for(let q = 0; q < questionText.length ;q++){
          alans[indx][`question${q}`] = questionText[q];
          if(ans.question_id == availableQuestions[q]) {
            alans[indx][`answer${q}`] = ans.answer;
          }
        }
        callers.push(ans.phone)
      } else {
        let indx  = alans.findIndex(item => item.phone == ans.phone);
        for(let q = 0; q < availableQuestions.length ;q++){
          alans[indx][`question${q}`] = questionText[q];
          if(ans.question_id == availableQuestions[q]) {
            alans[indx][`answer${q}`] = ans.answer;
          }
        }
      }
    });
    this.allAnswers = alans;
    this.questionText = questionText;
    this.filterAnswers();
  }

  filterAnswers() {
    this.filteredAnswers = this.allAnswers;
    this.csvData = [];
    this.filteredAnswers.forEach(
      svs => {
        let irm:any = {
          'Phone': svs.phone+'',
          'Customer Name': svs.customer_name || '',
          'Customer Id': svs.customer_id || '',
          'Called At': svs.created_at || '',
          'Survey Id': svs.survey_id || '',
          'Survey Name': this.surveyData.name || '',
        }
        for(let q = 0; q < this.questionText.length; q++) {
          irm[this.questionText[q]+''] = svs[`answer${q}`] || '-'; 
        };
        this.csvData.push(irm)
      }
    )
  }

  get questionForm() {
    return this.addQuestionForm.controls;
  }

  addQuestion(modal) {
    // {survey_id,question,question_type("boolean","number","voice","options")}
    for (const key in this.addQuestionForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.addQuestionForm.controls, key)) {
         if(key == 'options') { 
            if(this.optionArray && this.optionArray.length) {
              for (const key in this.optionArray.controls) {
                if (Object.prototype.hasOwnProperty.call(this.optionArray.controls, key)) {
                  let ks:any = this.optionArray.controls[key];
                  for (const cKey in ks.controls) {
                    ks.controls[cKey].markAsDirty()
                  }
                }
              }
            }
         } else {
           this.addQuestionForm.controls[key].markAsDirty();
         }
      }
    }
    if(this.addQuestionForm.invalid) {
      return;
    }

    let data = this.addQuestionForm.value;
    data.originalQuestion = `${data.question}`;
    if(data.options && data.options.length) {
      data.options.forEach(element => {
        data.question = `${data.question} press ${element.key} for ${element.title}`
      });
    }
    data.survey_id = this.survey_id;
    this.addingQuestion = true;
    this._surveyService.addQuestion(data).subscribe(
      res => {
        if(!res.error) {
          this.closed(modal)
          this.getSurvey();
          this.toastr.successToastr(res.msg);
        } else {
          this._authService.errorToaster(res);
        }
        this.addingQuestion = false;
      }, error => {
        this.addingQuestion = false;
        this.toastr.errorToastr('Something went wrong while adding survey, please try again later');
      }
    );
    
  }

  deleteQuestion(modal) {
    this.deletingQuestion = true;
    this._surveyService.deleteQuestion({id: this.toDelete.id}).subscribe(
      res => {
        if(!res.error) {
          this.closed(modal)
          this.getSurvey();
          this.toastr.successToastr(res.msg);
        } else {
          this._authService.errorToaster(res);
        }
        this.deletingQuestion = false;
      }, error => {
        this.deletingQuestion = false;
        this.toastr.errorToastr('Something went wrong while activating this survey, please try again later');
      }
    );
  }

  openQuestionModal() {
    this.initQuestion();
    this.modalOpenOSE(this.addQuestionModal, 'lg');
  }
  openDeleteModal(question= null) {
    if(question) {
      this.toDelete = question
      this.modalOpenOSE(this.deleteQuestionModal, 'lg');
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
