import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProjectData } from './project.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'projects-cmp',
  moduleId: module.id,
  templateUrl: 'projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent {

  formValue!: FormGroup
  projectObject: ProjectData = new ProjectData;
  projectData: any;
  submitBtn!: boolean;
  showUpdateBtn!: boolean;
  viewBtn!: boolean;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tasksSelected: string[] = [];
  allTasks: any;
  admins: any;
  managers: any;
  roles: any;
  displayedColumns: string[] = ['name', 'status', 'admin', 'manager', 'role', 'tasks', 'sdate', 'edate','action'];

  private changeCallback: Function;
  dataSource: MatTableDataSource<any>;

  @ViewChild('taskInput') taskInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private cd: ChangeDetectorRef,) { }
  display = "none";

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    if (value) {
      this.tasksSelected.push(value);
    }
  }

  remove(task: string): void {
    const index = this.tasksSelected.indexOf(task);
    if (index >= 0) {
      this.tasksSelected.splice(index, 1);
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
      status: false,
      admin: [''],
      manager: [''],
      role: [''],
      tasks: [''],
      sdate: [''],
      edate: ['']
    })
    this.getProjectData();
    this.getTaskData();
    this.getAdminData();
    this.getManagersData();
    this.getRoleData();
  }

  openModal() {
    
    this.display = "block";
    this.submitBtn = true;
    this.showUpdateBtn = false;
    this.viewBtn = false;
    this.formValue.reset();
    if(this.submitBtn){
      this.getTaskData();
      this.tasksSelected=[];
    }
  
  }
  onCloseHandled() {
    this.display = "none";
    
  }

  addData() {

    console.log(this.formValue.value)
    this.onCloseHandled();
    this.projectObject.id = this.formValue.value.id;
    this.projectObject.name = this.formValue.value.name;
    this.formValue.value.status ? this.projectObject.status = 'Active' : this.projectObject.status = 'Inactive'
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    console.log(this.formValue.value)
    this.projectObject.tasks = this.formValue.value.tasks;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    this.http.post<any>("http://localhost:3000/comments", this.projectObject).subscribe((res) => {
      console.log(res);
      this.getProjectData();
    })

  }

  getProjectData() {
    this.http.get("http://localhost:3000/comments").subscribe((res) => {
      this.projectData = res;
      this.dataSource=new MatTableDataSource(this.projectData);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    })

  }

  getTaskData() {
    this.http.get("http://localhost:3000/tasks").subscribe((res) => {
      this.allTasks = res;

    })
  }

  getAdminData() {
    this.http.get("http://localhost:3000/admin").subscribe((res) => {
      this.admins = res;
    })
  }

  getRoleData() {
    this.http.get("http://localhost:3000/roles").subscribe((res) => {
      this.roles = res;
    })
  }

  getManagersData() {
    this.http.get("http://localhost:3000/manager").subscribe((res) => {
      this.managers = res;
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
    this.tasksSelected = data.tasks;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);
    
  }

  viewData() {
    
    this.display = "none";
    this.formValue.reset();
    this.tasksSelected=[];
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
    this.tasksSelected = data.tasks;
    this.formValue.controls['tasks'].setValue(this.tasksSelected);
    this.formValue.controls['sdate'].setValue(data.sdate);
    this.formValue.controls['edate'].setValue(data.edate);

  }

  updateData() {
    this.projectObject.id = this.formValue.value.id;
    this.projectObject.name = this.formValue.value.name;
    this.formValue.value.status ? this.projectObject.status = 'Active' : this.projectObject.status = 'Inactive'
    this.projectObject.admin = this.formValue.value.admin;
    this.projectObject.manager = this.formValue.value.manager;
    this.projectObject.role = this.formValue.value.role;
    this.projectObject.tasks = this.tasksSelected;
    this.projectObject.sdate = this.formValue.value.sdate;
    this.projectObject.edate = this.formValue.value.edate;

    this.http.put("http://localhost:3000/comments/" + this.projectObject.id, this.projectObject).subscribe((res) => {
      console.log(res);
      this.getProjectData();
      this.display = "none";
    })
    this.formValue.reset();
    this.tasksSelected=[];
  }

  optionClicked(event: Event, item) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(task) {
    task.selected = !task.selected;
    if (task.selected) {
      this.tasksSelected.push(task);
      this.changeCallback(this.tasksSelected);
    } else {
      const i = this.tasksSelected.findIndex(value => value === task);
      this.tasksSelected.splice(i, 1);
      this.changeCallback(this.tasksSelected);
    }

  }
}
