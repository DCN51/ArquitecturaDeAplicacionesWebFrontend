import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

import { Logincomponent } from './logincomponent';

describe('Formulario de inicio de sesión', () => {
  let http: HttpTestingController;
  let component: Logincomponent;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ imports: [Logincomponent], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: { snapshot: {
        data: {}, queryParamMap: convertToParamMap({})
      } } }
    ] });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Logincomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loginForm.patchValue({ username: ' ana ', password: 'secreto123' });
  });

  afterEach(() => { http.verify(); sessionStorage.clear(); });

  it('consume LoginRequestDTO y LoginResponseDTO sin guardar la contraseña', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.iniciarSesion();
    const request = http.expectOne(`${environment.base}/login`);
    expect(request.request.body).toEqual({ username: 'ana', password: 'secreto123' });
    const response = { token: 'jwt-del-backend', username: 'ana', rol: 'ROLE_PACIENTE' };
    request.flush(response);
    expect(JSON.parse(sessionStorage.getItem('mindhealth.sesion')!)).toEqual(response);
    expect(navigate).toHaveBeenCalledWith(['/app']);
    expect(component.loginForm.value.password).toBe('');
  });

  it('permite reintentar después de credenciales rechazadas sin crear una sesión', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.iniciarSesion();
    http.expectOne(`${environment.base}/login`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(component.enviando).toBe(false);
    expect(sessionStorage.getItem('mindhealth.sesion')).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
    expect(component.mensaje).toContain('Verifica tu usuario');
  });
});
