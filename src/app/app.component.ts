import { Component } from '@angular/core';

import { ReactiveLoginComponent } from './auth/login-reactive/login-reactive.component';
import { TemplateDrivenLoginComponent } from './auth/login-template-driven/login-template-driven.component';
import { SignupComponent } from './auth/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    TemplateDrivenLoginComponent,
    SignupComponent,
    ReactiveLoginComponent,
  ],
})
export class AppComponent {}
