import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RoleData } from './roles.model';

@Component({
  moduleId: module.id,
  selector: 'roles-cmp',
  templateUrl: 'roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {

  formValue!: FormGroup
  roleObject: RoleData = new RoleData;
  roleData: any;
  submitBtn!:boolean;
  showUpdateBtn!:boolean;
  viewBtn!: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
   }
  display = "none";

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: [''],
      status: [''],
      permissions: ['']
    })
    this.getRoleData();
  }

  openModal() {
    this.display = "block";
    this.submitBtn=true;
    this.showUpdateBtn=false;
    this.viewBtn=false;
  }
  onCloseHandled() {
    this.display = "none";
  }

  addData() {
    
    console.log(this.formValue.value)
    this.onCloseHandled();
    this.roleObject.id = this.formValue.value.id;
    this.roleObject.name = this.formValue.value.name;
    this.roleObject.status = this.formValue.value.status;
    this.roleObject.permissions = this.formValue.value.permissions;

    this.http.post<any>("http://localhost:3000/posts", this.roleObject).subscribe((res) => {
      console.log(res);
      this.getRoleData();
    })
    this.formValue.reset();

  }

  getRoleData() {
    this.http.get("http://localhost:3000/posts").subscribe((res) => {
      this.roleData = res;
    })

  }

  deleteRole(data: any) {
    this.http.delete("http://localhost:3000/posts/" + data.id).subscribe((res) => {
      console.log(res);
      this.getRoleData();
    })
  }

  ViewRole(data:any){
    this.display = "block";
    this.viewBtn=true;
    this.submitBtn=false;
    this.showUpdateBtn=false;
    this.formValue.controls['id'].setValue(data.id);
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['permissions'].setValue(data.permissions);
  }

  viewData(){
    this.formValue.reset();
    this.display = "none";
  }

  updateRole(data: any) {
    this.display="block";
    this.submitBtn=false;
    this.showUpdateBtn=true;
    this.viewBtn=false;

    this.formValue.controls['id'].setValue(data.id)
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.formValue.controls['permissions'].setValue(data.permissions);
    
  }

  updateData(){
    this.roleObject.id = this.formValue.value.id;
    this.roleObject.name = this.formValue.value.name;
    this.roleObject.status = this.formValue.value.status;
    this.roleObject.permissions = this.formValue.value.permissions;

    this.http.put("http://localhost:3000/posts/"+this.roleObject.id,this.roleObject).subscribe((res) => {
      console.log(res);
      this.formValue.reset();
      this.getRoleData();
      this.display = "none";
    })
  }

  
}
