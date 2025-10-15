import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';

// Custom validator in reactive forms:
function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { questionMark: true };
}

// Custom asnync validator in reactive forms. Here we could query a server
// for valid input and return a suitable observable.
function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({ emailUnique: true });
}

@Component({
  selector: 'app-login-reactive',
  standalone: true,
  templateUrl: './login-reactive.component.html',
  styleUrl: './login-reactive.component.css',
  imports: [ReactiveFormsModule],
})
export class ReactiveLoginComponent {
  // THIS APPROACH IS REACTIVE FORMS:

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get emailIsInvalid() {
    const emailControl = this.form.controls.email;
    if (emailControl.touched && emailControl.dirty && emailControl.errors) {
      if (emailControl.errors['required']) {
        return 'Email canot be empty.';
      }
      if (emailControl.errors['email']) {
        return 'Invalid email format.';
      }
      if (emailControl.errors['emailUnique'] !== null) {
        return 'Email already registered.';
      }
    }
    return null;
  }

  get passwordIsInvalid() {
    const pwControl = this.form.controls.password;
    if (pwControl.touched && pwControl.dirty && pwControl.errors) {
      if (pwControl.errors['required']) {
        return 'Password canot be empty.';
      }
      if (pwControl.errors['questionMark']) {
        return 'Password must contain question mark(s).';
      }
      if (pwControl.errors['minLength'] !== null) {
        return 'Password must be of at least 6 characters long.';
      }
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form);
      console.log(this.form.controls.email);
      console.log(this.form.value.password);
    }
  }
}
