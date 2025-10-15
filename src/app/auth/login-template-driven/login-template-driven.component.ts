import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login-template-driven',
  standalone: true,
  templateUrl: './login-template-driven.component.html',
  styleUrl: './login-template-driven.component.css',
  imports: [FormsModule],
})
export class TemplateDrivenLoginComponent {
  // THIS APPROACH IS TEMPLATE-DRIVEN FORMS:

  loginForm = viewChild.required<NgForm>('loginForm');
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Save user's latest inputs to local storage and prepopulate them upon revisit if form
    // is not yet submitted (because then we reset the form).
    // We use afterNextRender to do this once after the form is fully initialized,
    // and necessary changes applied to it.
    // We use observable Rx-Js utility to subscribe and implement this functionality:
    // NOTE: debounceTime is used for performance considerations, as saving all
    // updates all the time will decrease performance. This way, we will not be
    // saving every keystroke while typing, but when the user stops for 500 milliseconds.
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-login-form');
      if (savedForm) {
        const savedEmail = JSON.parse(savedForm).email;
        // setTimeout is for fully initialization of form controls to avoid
        // setValue call on undefined... Better solution is by using reactive forms.
        setTimeout(() => {
          this.loginForm().controls['email'].setValue(savedEmail);
        }, 1);
      }
      const subscription = this.loginForm()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email })
            );
          },
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(loginForm: NgForm) {
    if (!loginForm.form.valid) {
      return;
    }
    console.log(loginForm.form);
    console.log(loginForm.form.value);
    console.log(loginForm.form.value.email);
    console.log(loginForm.form.value.password);

    // Cannot be used in template-driven forms, only available in reactive forms:
    // console.log(loginForm.form.controls.email);

    // Can be used for dynamic validation logic changes:
    // loginForm.form.clearValidators();
    // loginForm.form.addValidators(..);

    loginForm.form.reset();

    // For an example of creating custom validator for template-driven forms, visit
    // https://angular.dev/guide/forms/form-validation#adding-custom-validators-to-template-driven-forms
  }
}
