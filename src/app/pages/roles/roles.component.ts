import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RoleData } from './roles.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
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
  isChecked = true;
  p: Number = 1;
  count: Number = 3;
  display = "none";
  separatorKeysCodes: number[] = [ENTER, COMMA];
  permissionsSelected: string[] =[];
  allPermissions: any ;

  @ViewChild('permissionInput') permissionInput: ElementRef<HTMLInputElement>;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {

   }
  
   add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    if (value) {
      this.permissionsSelected.push(value);
    }
    this.formValue.value.permissions.setValue(null);
  }

  remove(permission: string): void {
    const index = this.permissionsSelected.indexOf(permission);

    if (index >= 0) {
      this.permissionsSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.permissionsSelected.push(event.option.viewValue);
    console.log(this.permissionsSelected)
    this.permissionInput.nativeElement.value = '';
    this.formValue.value.permissions.setValue(null);
  }
  
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: [''],
      status: [''],
      permissions: [''],
  
    })
    this.getPermissionData();
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
    
    this.onCloseHandled();
    this.roleObject.id = this.formValue.value.id;
    this.roleObject.name = this.formValue.value.name;
    this.formValue.value.status ? this.roleObject.status = 'Active': this.roleObject.status = 'Inactive';
    this.formValue.controls['permissions'].setValue(this.permissionsSelected);
    console.log(this.formValue.value)
    this.roleObject.permissions = this.formValue.value.permissions;

    this.http.post<any>("http://localhost:3000/posts", this.roleObject).subscribe((res) => {
      console.log(res);
      this.getRoleData();
    })
    this.formValue.reset();
    this.permissionsSelected=null;

  }

  getRoleData() {
    this.http.get("http://localhost:3000/posts").subscribe((res) => {
      this.roleData = res;
    })

  }

  getPermissionData() {
    this.http.get("http://localhost:3000/profile").subscribe((res) => {
      this.allPermissions=res;
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
    
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['status'].setValue(data.status);
    this.permissionsSelected=data.permissions;
    this.formValue.controls['permissions'].setValue(this.permissionsSelected);
  }

  viewData(){
   
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
    this.permissionsSelected=data.permissions;
    this.formValue.controls['permissions'].setValue(this.permissionsSelected);
  }

  updateData(){
    this.roleObject.id = this.formValue.value.id;
    this.roleObject.name = this.formValue.value.name;
    this.formValue.value.status ? this.roleObject.status = 'Active': this.roleObject.status = 'Inactive'
    this.roleObject.permissions = this.permissionsSelected;

    this.http.put("http://localhost:3000/posts/"+this.roleObject.id,this.roleObject).subscribe((res) => {
      console.log(res);
      this.formValue.reset();
      this.getRoleData();
      this.display = "none";
    })
  }

  
}
