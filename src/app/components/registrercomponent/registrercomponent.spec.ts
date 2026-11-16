import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

import { Registrercomponent } from './registrercomponent';

describe('Formulario de registro', () => {
  let http: HttpTestingController;
  let component: Registrercomponent;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ imports: [Registrercomponent], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting()
    ] });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Registrercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(`${environment.base}/api/roles`).flush([
      { roleId: 7, name: 'PACIENTE' }, { roleId: 9, name: 'ROLE_PSICOLOGO' },
      { roleId: 1, name: 'ADMINISTRADOR' }
    ]);
    component.registroForm.patchValue({ username: 'ana', contrasena: 'secreto123', confirmar: 'secreto123',
      rolId: 7, nombres: 'Ana', apellidos: 'Perez', correoElectronico: 'ana@example.com',
      telefono: '999999999', fechaNacimiento: '2000-01-01', genero: 'Femenino' });
  });
  afterEach(() => { http.verify(); sessionStorage.clear(); });

  it('usa los IDs del backend y no ofrece registro de administradores', () => {
    expect(component.roles.map(rol => rol.roleId)).toEqual([7, 9]);
  });
  it('requiere datos profesionales para un psicólogo', () => {
    component.registroForm.controls['rolId'].setValue(9);
    component.registrar();
    http.expectNone(`${environment.base}/api/usuarios`);
    expect(component.registroForm.controls['numeroColegiatura'].invalid).toBe(true);
    expect(component.registroForm.controls['especializacion'].invalid).toBe(true);
  });
  it('rechaza contraseñas diferentes antes de enviar el registro', () => {
    component.registroForm.controls['confirmar'].setValue('diferente');
    component.registrar();
    http.expectNone(`${environment.base}/api/usuarios`);
    expect(component.mensaje).toContain('no coinciden');
  });
  it('registra y abre el formulario de inicio de sesión', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.registrar();
    const registro = http.expectOne(`${environment.base}/api/usuarios`);
    expect(registro.request.body.rolId).toBe(7);
    expect(registro.request.body.numeroColegiatura).toBeNull();
    registro.flush({ userId: 12, username: 'ana', roleId: 7, roleName: 'PACIENTE',
      firstName: 'Ana', lastName: 'Perez', email: 'ana@example.com', phone: '999999999',
      birthDate: '2000-01-01', gender: 'Femenino', accountStatus: 'ACTIVO' });
    http.expectNone(`${environment.base}/login`);
    expect(navigate).toHaveBeenCalledWith(['/iniciar-sesion'], { queryParams: { registrado: '1' } });
    expect(component.registroForm.controls['contrasena'].value).toBeNull();
  });

  it('envía los campos profesionales y los nombres exactos del DTO del backend', () => {
    component.registroForm.patchValue({ rolId: 9, numeroColegiatura: ' CP123 ',
      especializacion: ' Clinica ', anosExperiencia: 4 });
    component.registrar();
    const request = http.expectOne(`${environment.base}/api/usuarios`);
    expect(request.request.body).toEqual({ username: 'ana', rolId: 9,
      nombres: 'Ana', apellidos: 'Perez', correoElectronico: 'ana@example.com',
      contrasena: 'secreto123', telefono: '999999999', fechaNacimiento: '2000-01-01',
      genero: 'Femenino', numeroColegiatura: 'CP123', especializacion: 'Clinica',
      anosExperiencia: 4 });
    request.flush({ message: 'El rol indicado no existe' }, { status: 400, statusText: 'Bad Request' });
    expect(component.mensaje).toBe('El rol indicado no existe');
    expect(component.enviando).toBe(false);
  });

  it('limita colegiatura y especialización a las longitudes de las columnas del backend', () => {
    component.registroForm.patchValue({ rolId: 9, numeroColegiatura: '1'.repeat(21),
      especializacion: 'a'.repeat(151), anosExperiencia: 4 });
    component.registrar();
    http.expectNone(`${environment.base}/api/usuarios`);
    expect(component.registroForm.get('numeroColegiatura')?.hasError('maxlength')).toBe(true);
    expect(component.registroForm.get('especializacion')?.hasError('maxlength')).toBe(true);
  });
});

