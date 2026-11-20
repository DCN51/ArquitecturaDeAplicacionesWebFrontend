import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Casoemergenciaservice } from '../../../services/casoemergenciaservice';
import { Usersservice } from '../../../services/usersservice';
import { CasoEmergenciaDTO } from '../../../models/CasoEmergenciaDTO';
import { UserDTO } from '../../../models/UserDTO';

@Component({
  selector: 'app-casoemergenciainsertcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './casoemergenciainsertcomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './casoemergenciainsertcomponent.css',
})
export class Casoemergenciainsertcomponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  casoForm: FormGroup;
  id: number = 0;
  edicion: boolean = false;
  encontrado: boolean = true;
  mensaje: string = '';
  hoy: Date = new Date();
  casoActual: CasoEmergenciaDTO = new CasoEmergenciaDTO();
  psicologos: UserDTO[] = [];
  niveles: string[] = ['bajo', 'medio', 'alto', 'critico'];
  estados: string[] = ['pendiente', 'en_atencion', 'cerrado'];

  constructor(
    private ceS: Casoemergenciaservice,
    private uS: Usersservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.casoForm = this.fb.group({
      codigo: [0],
      usuarioId: [null, [Validators.required, Validators.min(1)]],
      sesionClinicaId: [null, [Validators.required, Validators.min(1)]],
      fechaEmergencia: [null],
      nivelUrgencia: ['', Validators.required],
      resumenContextual: [''],
      psicologoId: [null],
      estado: ['pendiente'],
      notasPsicologo: ['']
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.edicion = this.route.snapshot.paramMap.get('id') != null;

    if (this.edicion) {
      if (!this.id || isNaN(this.id)) {
        this.encontrado = false;
        this.mensaje = 'Caso no encontrado';
        return;
      }
      this.cargarPsicologos();
      this.buscarCaso();
    }
  }

  cargarPsicologos(): void {
    this.uS.getUsuarios().subscribe({
      next: (data: UserDTO[]) => {
        this.psicologos = data.filter(u => u.roleName.toUpperCase().includes('PSICOLOGO'));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.psicologos = [];
        this.cdr.detectChanges();
      }
    });
  }

  buscarCaso(): void {
    this.ceS.listId(this.id).subscribe({
      next: (c: CasoEmergenciaDTO) => {
        this.casoActual = c;
        this.encontrado = true;
        this.casoForm.patchValue({
          codigo: c.casoEmergenciaId,
          usuarioId: c.usuarioId,
          sesionClinicaId: c.sesionClinicaId,
          nivelUrgencia: c.nivelUrgencia,
          resumenContextual: c.resumenContextual,
          psicologoId: c.psicologoId,
          estado: c.estado,
          notasPsicologo: c.notasPsicologo
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.encontrado = false;
        this.mensaje = err.status === 404 ? 'Caso no encontrado' : 'Error al consultar el caso';
        this.cdr.detectChanges();
      }
    });
  }

  guardarCaso(): void {
    if (this.casoForm.invalid) {
      this.casoForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const caso: CasoEmergenciaDTO = new CasoEmergenciaDTO();
    caso.usuarioId = this.casoForm.value.usuarioId;
    caso.sesionClinicaId = this.casoForm.value.sesionClinicaId;
    caso.nivelUrgencia = this.casoForm.value.nivelUrgencia;
    caso.resumenContextual = this.casoForm.value.resumenContextual || null;

    if (this.edicion) {
      caso.casoEmergenciaId = this.id;
      caso.fechaEmergencia = this.casoActual.fechaEmergencia;
      caso.fechaCierre = this.casoActual.fechaCierre;
      caso.psicologoId = this.casoForm.value.psicologoId;
      caso.estado = this.casoForm.value.estado;
      caso.notasPsicologo = this.casoForm.value.notasPsicologo || null;

      this.ceS.update(caso).subscribe({
        next: () => {
          this.mensaje = 'Caso actualizado correctamente';
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/casos-emergencia/listar']), 1200);
        },
        error: (err) => {
          console.log(err);
          this.mensaje = this.mensajeError(err, 'Error al actualizar el caso');
          this.cdr.detectChanges();
        }
      });
    } else {
      caso.fechaEmergencia = this.aTexto(this.casoForm.value.fechaEmergencia);
      caso.estado = 'pendiente';

      this.ceS.insert(caso).subscribe({
        next: (data: CasoEmergenciaDTO) => {
          this.mensaje = `Caso ${data.casoEmergenciaId} registrado correctamente`;
          this.formDirective.resetForm({ codigo: 0, estado: 'pendiente' });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.mensaje = this.mensajeError(err, 'Error al registrar el caso');
          this.cdr.detectChanges();
        }
      });
    }
  }

  private mensajeError(err: any, porDefecto: string): string {
    if (err.status === 404) {
      return err.error?.message || 'No existe el paciente, la sesión o el psicólogo indicado';
    }
    if (err.status === 400) {
      return err.error?.message || 'Revise los datos ingresados';
    }
    if (err.status === 401 || err.status === 403) {
      return 'No tienes permiso para realizar esta acción';
    }
    return porDefecto;
  }

  private aTexto(fecha: Date | null): string | null {
    if (!fecha) {
      return null;
    }
    return `${fecha.toLocaleDateString('en-CA')}T${new Date().toTimeString().substring(0, 8)}`;
  }
}
