import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms'

interface Country {
  id?: number;
  ename: string;
  designation: string;
  project: string;
}

const COUNTRIES: Country[] = [
  {
    ename: 'Shrinivas',
    designation: 'Manager',
    project: 'Eversana'
   
  },
  {
    ename: 'Pooja',
    designation: 'Front End Developer',
    project: 'Eversana'
   
  },
  {
    ename: 'Manisha',
    designation: 'RPA Developer',
    project:'Eversana'
    
  },
  {
    ename: 'Swapnil',
    designation: 'Project Manager',
    project: 'Eversana'
   
  },
  {
    ename: 'Supriya',
    designation: 'RPA Lead',
    project: 'Eversana'
  
  }

];

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  page = 1;
  pageSize = 4;
  collectionSize = COUNTRIES.length;
  countries: Country[];
  closeResult = '';
  formValue!:FormGroup

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.refreshCountries();
  }

  open(content,id:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  refreshCountries() {
    this.countries = COUNTRIES
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
    ngOnInit(){}

}
