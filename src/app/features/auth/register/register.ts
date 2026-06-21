import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { passwordValidator } from '../validators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: '../login/login.css', 
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private http = inject(HttpClient);

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator]],
      password: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  emailAsyncValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return this.http.get<any[]>(`http://localhost:3000/users?email=${control.value.trim()}`).pipe(
      map(users => (users.length > 0 ? { emailExists: true } : null)),
      catchError(() => of(null)) 
    );
  };

  passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmControl = group.get('confirmPassword');

    if (!confirmControl) {
      return null;
    }

    if (password !== confirmControl.value) {
      confirmControl.setErrors({ ...confirmControl.errors, passwordMismatch: true });
    } else {
      const errors = { ...confirmControl.errors };
      delete errors['passwordMismatch'];
      confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };

  submitForm(): void {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
      const payload = { firstName, lastName, email: email.trim(), password };

      this.http.post('http://localhost:3000/users', payload).subscribe({
        next: () => {
          this.message.success('Account created successfully on the local server!');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Eroare:', err);
          this.message.error('The local server is not running.');
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}