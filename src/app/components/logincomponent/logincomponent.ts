import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginRequestDTO } from '../../models/LoginRequestDTO';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-logincomponent',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent implements OnInit {
  loginForm: FormGroup;
  mensaje: string = '';
  enviando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: Loginservice,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/\S/)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('registrado') === '1') {
      this.mensaje = 'Cuenta creada. Inicia sesión con tu usuario y contraseña.';
    }
  }

  iniciarSesion(): void {
    if (this.enviando) {
      return;
    }
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.mensaje = 'Complete el usuario y la contraseña';
      return;
    }
    this.enviando = true;
    this.mensaje = '';
    const login: LoginRequestDTO = {
      username: this.loginForm.value.username.trim(),
      password: this.loginForm.value.password
    };
    this.loginService.login(login).subscribe({
      next: () => {
        this.enviando = false;
        this.loginForm.reset({ username: '', password: '' });
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination =
          returnUrl?.startsWith('/') && !returnUrl.startsWith('//') && returnUrl !== '/'
            ? returnUrl
            : '/app';

        void this.router.navigateByUrl(destination);
      },
      error: (err) => {
        console.log(err);
        this.enviando = false;
        if (err.status === 0) {
          this.mensaje = 'No se pudo conectar con el servidor.';
        } else if (err.status === 401 || err.status === 403) {
          this.mensaje = err.error?.message || 'Verifica tu usuario y contraseña y que tu cuenta esté activa.';
        } else {
          this.mensaje = err.error?.message || 'No se pudo iniciar sesión';
        }
        this.cdr.detectChanges();
      }
    });
  }

}
