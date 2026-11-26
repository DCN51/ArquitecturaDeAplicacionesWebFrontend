import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Asignacionpacienteservice } from '../../../services/asignacionpacienteservice';
import { Psicologoservice } from '../../../services/psicologoservice';
import { Usersservice } from '../../../services/usersservice';
import { AsignacionPacienteDTO } from '../../../models/AsignacionPacienteDTO';
import { PsicologoDTO } from '../../../models/PsicologoDTO';
import { UserDTO } from '../../../models/UserDTO';

@Component({
  selector: 'app-psicologoasignarcomponent',
  imports: [ReactiveFormsModule, DatePipe, MatFormFieldModule, MatSelectModule, MatButtonModule, MatTableModule],
  templateUrl: './psicologoasignarcomponent.html',
  styleUrl: './psicologoasignarcomponent.css',
})
export class Psicologoasignarcomponent implements OnInit {
  asignacionForm: FormGroup;
  pacientes: UserDTO[] = [];
  psicologos: PsicologoDTO[] = [];
  asignaciones: AsignacionPacienteDTO[] = [];
  displayedColumns: string[] = ['paciente', 'psicologo', 'fecha'];
  mensaje: string = '';
  mensajeLista: string = 'Cargando...';

  constructor(
    private aS: Asignacionpacienteservice,
    private pS: Psicologoservice,
    private uS: Usersservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.asignacionForm = this.fb.group({
      pacienteId: [null, Validators.required],
      psicologoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarPsicologos();
    this.cargarAsignaciones();
  }

  cargarPacientes(): void {
    this.uS.getUsuarios().subscribe({
      next: (data: UserDTO[]) => {
        this.pacientes = data.filter(u => u.roleName.replace('ROLE_', '') === 'PACIENTE' && u.accountStatus === 'ACTIVO');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener los pacientes';
        this.cdr.detectChanges();
      }
    });
  }

  cargarPsicologos(): void {
    this.pS.getPsicologos().subscribe({
      next: (data: PsicologoDTO[]) => {
        this.psicologos = data.filter(p => p.estadoVerificacion === 'VERIFICADO' && p.estadoCuenta === 'ACTIVO');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener los psicólogos';
        this.cdr.detectChanges();
      }
    });
  }

  cargarAsignaciones(): void {
    this.aS.getAsignaciones().subscribe({
      next: (data: AsignacionPacienteDTO[]) => {
        this.asignaciones = data;
        this.mensajeLista = data.length > 0 ? '' : 'No hay pacientes asignados';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensajeLista = err.error?.message || 'Ocurrió un error al obtener las asignaciones';
        this.cdr.detectChanges();
      }
    });
  }

  psicologoActual(pacienteId: number): string {
    return this.asignaciones.find(a => a.pacienteId === pacienteId)?.nombrePsicologo ?? '';
  }

  asignarPaciente(): void {
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      this.mensaje = 'Elija un paciente y un psicólogo';
      return;
    }

    const pacienteId = this.asignacionForm.value.pacienteId;
    const psicologoId = this.asignacionForm.value.psicologoId;

    this.aS.insert(pacienteId, psicologoId).subscribe({
      next: (data: AsignacionPacienteDTO) => {
        this.mensaje = `${data.nombrePaciente} quedó asignado a ${data.nombrePsicologo}`;
        this.asignacionForm.reset({ pacienteId: null, psicologoId: null });
        this.cargarPsicologos();
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Error al asignar el paciente';
        this.cdr.detectChanges();
      }
    });
  }
}
