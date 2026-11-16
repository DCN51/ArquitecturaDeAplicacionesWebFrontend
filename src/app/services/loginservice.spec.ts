import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Loginservice } from './loginservice';
import { Registrerservice } from './registrerservice';
import { Diagnosticoclinicoservice } from './diagnosticoclinicoservice';
import { Sesionclinicaservice } from './sesionclinicaservice';
import { SesionClinicaDTO } from '../models/SesionClinicaDTO';
import { environment } from '../../environments/environment.development';

describe('Autenticación con el backend', () => {
  let loginService: Loginservice;
  let http: HttpTestingController;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    loginService = TestBed.inject(Loginservice);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); sessionStorage.clear(); });

  it('envía las credenciales y no guarda una sesión cuando el servidor las rechaza', () => {
    let rechazado = false;
    loginService.login({ username: 'ana', password: 'incorrecta' }).subscribe({ error: () => { rechazado = true; } });
    const request = http.expectOne(`${environment.base}/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'ana', password: 'incorrecta' });
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(rechazado).toBe(true);
    expect(loginService.sesion()).toBeNull();
  });

  it('envía la identidad del psicólogo al validar un diagnóstico', () => {
    loginService.guardarSesion({ token: 'jwt-del-servidor', username: 'psicologo', rol: 'PSICOLOGO' });
    TestBed.inject(Diagnosticoclinicoservice).validar(3).subscribe();
    const request = http.expectOne(`${environment.base}/api/diagnosticos/3/validar`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-del-servidor');
    request.flush({ diagnosticoClinicoId: 3 });
  });

  it('registra sin autenticar y elimina los datos al cerrar sesión', () => {
    const datos = { username: 'ana', rolId: 7, nombres: 'Ana', apellidos: 'Perez',
      correoElectronico: 'ana@example.com', contrasena: 'secreto123', telefono: '999999999',
      fechaNacimiento: '2000-01-01', genero: 'Femenino',
      numeroColegiatura: null, especializacion: null, anosExperiencia: null };
    TestBed.inject(Registrerservice).registrar(datos).subscribe();
    const request = http.expectOne(`${environment.base}/api/usuarios`);
    expect(request.request.body).toEqual(datos);
    request.flush({ userId: 9, username: 'ana' });
    expect(loginService.sesion()).toBeNull();
    loginService.guardarSesion({ token: 'jwt', username: 'ana', rol: 'ROLE_PACIENTE' });
    expect(loginService.tieneRol(['PACIENTE'])).toBe(true);
    expect(loginService.tieneRol(['ADMINISTRADOR'])).toBe(false);
    loginService.logout();
    expect(loginService.sesion()).toBeNull();
  });

  it('envía el JWT a sesiones y diagnósticos sin abrir endpoints del backend', () => {
    loginService.guardarSesion({ token: 'jwt-del-servidor', username: 'ana', rol: 'PACIENTE' });
    const sesion = new SesionClinicaDTO();
    sesion.usuarioId = 9;
    TestBed.inject(Sesionclinicaservice).iniciar(sesion).subscribe();
    const inicio = http.expectOne(`${environment.base}/api/sesiones`);
    expect(inicio.request.method).toBe('POST');
    expect(inicio.request.body).toEqual(sesion);
    expect(inicio.request.headers.get('Authorization')).toBe('Bearer jwt-del-servidor');
    inicio.flush({ ...sesion, sesionClinicaId: 3 });

    TestBed.inject(Diagnosticoclinicoservice).historial(9).subscribe();
    const historial = http.expectOne(`${environment.base}/api/diagnosticos/usuario/9`);
    expect(historial.request.method).toBe('GET');
    expect(historial.request.headers.get('Authorization')).toBe('Bearer jwt-del-servidor');
    historial.flush([]);
  });
});
