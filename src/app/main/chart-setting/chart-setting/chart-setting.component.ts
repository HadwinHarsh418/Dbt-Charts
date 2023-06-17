import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as feather from 'feather-icons';
import { FileHandle } from 'fs/promises';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-chart-setting',
  templateUrl: './chart-setting.component.html',
  styleUrls: ['./chart-setting.component.scss']
})
export class ChartSettingComponent implements OnInit {
  @ViewChild('CSVRecord') csvReader: any; 
  chartForm !:FormGroup
  fileUploaded:boolean=false;
  dynamicArray:any[] = [{"Name":"Left","Side":"0","Min":"20","Max":"20","Type":"0"}];
  chooseFileArr:any[]=["csv"]
  tab:number=1;
  active = 2;
  activeDelayed:any;
  isLoading:boolean =false;

  UnitsArray:any[] = [{"Name":"Pressure","Symbol":"PSI", "Scale":"0"},{"Name":"Tempreature","Symbol":"F", "Scale":"1"}];
  plotArray:any[] = [];

  submit:boolean = false;
  unitSubmit:boolean = false;
  dataSubmit:boolean = false;
  fileName: any;
  userArray: any;
  records: any[];
  newRows: any[]=[];
  sepratedHdrs:any[] =[];
  constructor(private formBuilder:FormBuilder,private toaster:ToastrManager,private http: HttpClient) { }

  ngOnInit(): void {
    this.init();

  }
  
  init(){
    this.chartForm = this.formBuilder.group({
      title:['',Validators.required]
    })
  }

  get genForm():any{
    return this.chartForm.controls;
  }

  nextTab(data){
    switch (data){
      case '1':{
        this.tab=2;
          setTimeout(() => {
          this.activeDelayed = 2
          },1000);
        break;
      }
      case '2':{
        this.chartForm.get('title')?.markAsDirty();
        if (this.chartForm.invalid) {
          return;
        }else{
          this.tab=3;
          setTimeout(() => {
          this.activeDelayed = 3
          },1000);
        }
        break;
      }
      case '3':{
        this.dynamicArray.forEach(element => {if(element.Name == "" || element.Side == "" || element.Min == "" || element.Max == "" || element.Type == "" ){this.submit = true}})
        if (this.submit) {
          return;
        }else{
          this.tab=4;
          setTimeout(() => {
          this.activeDelayed =4;
          },1000);
        }
        break;
      }
      case '4':{
        this.UnitsArray.forEach((item:any)=>{ 
          if(!item.Name || !item.Symbol || !item.Scale){this.unitSubmit = true;}})
        if(this.unitSubmit){
          return;
        }else{
          this.tab=5;
          setTimeout(() => {
          this.activeDelayed =5;
          },1000);
        }
        break;
      }
      case '5':{
        this.plotArray.forEach(item=>{if(!item.title || !item.unit){this.dataSubmit=true;}})
        if(this.dataSubmit){
          return;
        }else{
          this.tab=6;
          setTimeout(() => {
          this.activeDelayed =6;
          },1000);
        }
        break;
      }
    }
  }

  addRow() {
    this.dynamicArray.push({ Name: '', Side: '', Min: '',Max:'',Type:'' });
    
  }
  deleteRow(index) {
    this.dynamicArray.splice(index, 1);
  }

  randomColors(){
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }

  addUnitRow() {
    this.UnitsArray.push({ Name: '', Symbol: '', Scale: '' });
  }
  deleteUnitRow(index) {
    this.UnitsArray.splice(index, 1);
  }

  addPlotRow() {
    this.plotArray.push({ Visible: '', Name: '', Units: '',Color:'' });
    
  }
  deletePlotRow(index) {
    this.plotArray.splice(index, 1);
  }
  handleFileInput(files:any){
    let fileValue = files.target.files
    this.isLoading = true;
    this.sepratedHdrs=[]
    this.plotArray=[]
    this.sepratedHdrs=[]
    
    let fileName = fileValue[0].type.split('/')
    if(this.chooseFileArr.includes(fileName[1])){
      this.fileUploaded = true;
      this.fileName = fileValue[0].name
      let input = files.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        this.newRows = [];
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
        this.sepratedHdrs= [];

        headersRow.forEach(item => {
          let unitTitle = item.split('[');
          unitTitle[0]
          this.sepratedHdrs.push(
            { 
              name:item, title:unitTitle[0].trim(), selector: unitTitle[0].trim().replace(/\s/ig, '_'),Scale:'2',
              unit: unitTitle[1] ? unitTitle[1].replace(']', ''): ''
            }
          )
          if(unitTitle[0].trim() != "Date")
          this.plotArray.push(
            { 
              name:item, title:unitTitle[0].trim(), selector: unitTitle[0].trim().replace(/\s/ig, '_'),Color:this.randomColors(),Visible:'',
              unit: unitTitle[1] ? unitTitle[1].replace(']', ''): ''
            }
          )
        })

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  

        this.records.forEach(item => {
          let itm = {};
          this.sepratedHdrs.forEach((tm, i) => {
            itm[tm.selector] = item[i]
          }) 

          //push new item
          this.newRows.push(itm);
        });
        console.log(
         this.newRows.filter((x, i, a) => a.indexOf(x) == i));
        console.log(this.plotArray);
        
        this.isLoading=false;
      };  
      reader.onerror = () => {  
        console.log('error is occured while reading file!'); 
        this.isLoading=false;
      };
    }else{
      this.fileName = "";
      this.toaster.errorToastr('Please Select Csv file');
      this.isLoading=false;
    }
    
    
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) { 
        csvArr.push(curruntRecord);  
      }  
    }  
    return csvArr;  
  }  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  removeFile(){
    this.fileUploaded = false;this.fileName='';this.newRows=[]
  }
}
