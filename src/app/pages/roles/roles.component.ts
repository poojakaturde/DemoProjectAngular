import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RoleData } from './roles.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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
  private changeCallback: Function;
  displayedColumns: string[] = ['name', 'status', 'permissions','action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('permissionInput') permissionInput: ElementRef<HTMLInputElement>;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {

   }
  
   add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    if (value) {
      this.permissionsSelected.push(value);
    }
    
  }

  remove(permission: string): void {
    const index = this.permissionsSelected.indexOf(permission);

    if (index >= 0) {
      this.permissionsSelected.splice(index, 1);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    if(this.submitBtn){
      this.getPermissionData();
      this.permissionsSelected=[];
    }
    
  }
  onCloseHandled() {
    this.display = "none";
    this.getRoleData();
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
    this.permissionsSelected=[];
  }

  getRoleData() {
    this.http.get("http://localhost:3000/posts").subscribe((res) => {
      this.roleData = res;
      this.dataSource=new MatTableDataSource(this.roleData);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
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
    this.formValue.reset();
    this.permissionsSelected=[];
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
    this.roleObject.permissions = this.formValue.value.permissions;

    this.http.put("http://localhost:3000/posts/"+this.roleObject.id,this.roleObject).subscribe((res) => {
      console.log(res);
      this.getRoleData();
      this.display = "none";
    })
    this.formValue.reset();
    this.permissionsSelected=[];
  }

  optionClicked(event: Event, item) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(permission) {
    permission.selected = !permission.selected;
    if (permission.selected) {
      this.permissionsSelected.push(permission);
      this.changeCallback(this.permissionsSelected);
    } else {
      const i = this.permissionsSelected.findIndex(value => value === permission);
      this.permissionsSelected.splice(i, 1);
      this.changeCallback(this.permissionsSelected);
    }

  }

}
