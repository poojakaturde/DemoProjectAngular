import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProjectData } from './project.model';

@Component({
  selector: 'projects-cmp',
  moduleId: module.id,
  templateUrl: 'projects.component.html'
})

export class ProjectsComponent {

  formValue!: FormGroup
  projectObject: ProjectData = new ProjectData;
  projectData: any;
  submitBtn!: boolean;
  showUpdateBtn!: boolean;
  viewBtn!: boolean;
  p: Number = 1;
  count: Number = 3;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }
  display = "none";

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: [''],
      status:false,
      admin: [''],
      manager: [''],
      role: [''],
      sdate: [''],
      edate: ['']
    })
    this.getProjectData();
  }

  openModal() {
    this.display = "block";
    this.submitBtn = true;
    this.showUpdateBtn = false;
    this.viewBtn = false;
    this.formValue.reset();
  }
  onCloseHandled() {
    this.display = "none";
  }

  addData() {
    
    console.log(this.formValue.value)
    this.onCloseHandled();
    this.projectObject.id = this.formValue.value.id;
    this.projectObject.name = this.formValue.value.name;
    this.formValue.value.status ? this.projectObject.status = 'Active': this.projectObject.status = 'Inactive'
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;


    this.http.post<any>("http://localhost:3000/comments", this.projectObject).subscribe((res) => {
      console.log(res);
      this.getProjectData();
    })
    this.formValue.reset();

  }

  getProjectData() {
    this.http.get("http://localhost:3000/comments").subscribe((res) => {
      this.projectData = res;
      console.log(this.projectData)
    })

  }

  deleteProject(data: any) {
    this.http.delete("http://localhost:3000/comments/" + data.id).subscribe((res) => {
      console.log(res);
      this.getProjectData();
    })
  }

  ViewProject(data: any) {
    this.display = "block";
    this.viewBtn = true;
    this.submitBtn = false;
    this.showUpdateBtn = false;
    this.formValue.controls['id'].setValue(data.id);
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['admin'].setValue(data.admin);
    this.formValue.controls['manager'].setValue(data.manager);
    this.formValue.controls['role'].setValue(data.role);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);
  }

  viewData() {
    this.formValue.reset();
    this.display = "none";
  }

  updateProject(data: any) {
    this.display = "block";
    this.submitBtn = false;
    this.showUpdateBtn = true;
    this.viewBtn = false;

    this.formValue.controls['id'].setValue(data.id)
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['admin'].setValue(data.admin);
    this.formValue.controls['manager'].setValue(data.manager);
    this.formValue.controls['role'].setValue(data.role);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);

  }

  updateData() {
    this.projectObject.id = this.formValue.value.id;
    this.projectObject.name = this.formValue.value.name;
    this.projectObject.status = this.formValue.value.status;
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    this.http.put("http://localhost:3000/comments/" + this.projectObject.id, this.projectObject).subscribe((res) => {
      console.log(res);
      this.formValue.reset();
      this.getProjectData();
      this.display = "none";
    })
  }

}
