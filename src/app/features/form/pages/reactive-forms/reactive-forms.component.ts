import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-reactive-forms",
  templateUrl: "./reactive-forms.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export default class ReactiveFormsComponent implements OnInit {
  disabledName = false;
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [""],
    });
  }


  toggleDisable() {
    const control = this.form.get('name');
    if (control?.disabled) {
      control.enable();
    } else {
      control?.disable();
    }
  }
}
