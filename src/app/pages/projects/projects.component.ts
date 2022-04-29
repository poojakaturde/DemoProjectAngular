import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'projects-cmp',
  moduleId: module.id,
  templateUrl: 'projects.component.html'
})

export class ProjectsComponent {

  formValue!: FormGroup

  constructor(private formBuilder: FormBuilder) { }
  display = "none";

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id: [''],
      name: [''],
      status: [''],
      admin: [''],
      manager: [''],
      role: [''],
      sdate: [''],
      edate: ['']
    })
  }

  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }

  addProjectData() {
    console.log(this.formValue.value)
    this.formValue.reset();
  }
}
