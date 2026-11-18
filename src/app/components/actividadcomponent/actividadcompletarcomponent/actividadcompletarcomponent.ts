import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';

@Component({
  selector: 'app-actividadcompletarcomponent',
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './actividadcompletarcomponent.html',
  styleUrl: './actividadcompletarcomponent.css',
})
export class Actividadcompletarcomponent implements OnInit {
  userId: number = 0;
  idActividad: number = 0;
  actividad: ActividadDTO | null = null;
  comentario: string = '';
  mensaje: string = '';

  constructor(
    private aS: Actividadservice,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // /actividades/completar/:userId/:id
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.idActividad = Number(this.route.snapshot.paramMap.get('id'));

    this.aS.getActividades(this.userId).subscribe({
      next: (data) => {
        const a = data.find(x => x.recommendedActivityId === this.idActividad);
        if (!a) {
          this.mensaje = 'Actividad no encontrada';
        } else {
          this.actividad = a;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Actividad no encontrada';
        this.cdr.detectChanges();
      }
    });
  }

  completarActividad(): void {
    if (this.comentario.length > 255) {
      this.mensaje = 'El comentario puede tener máximo 255 caracteres';
      return;
    }

    const feedback = this.comentario.trim() ? this.comentario.trim() : null;   // opcional

    this.aS.completar(this.idActividad, feedback).subscribe({
      next: () => {
        this.mensaje = 'Actividad completada correctamente';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/actividades/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'Solo se pueden completar actividades pendientes';
        } else if (err.status === 404) {
          this.mensaje = 'Actividad no encontrada';
        } else if (err.status === 403) {
          this.mensaje = 'Esta actividad no está asignada a ti';
        } else {
          this.mensaje = 'Error al completar la actividad';
        }
        this.cdr.detectChanges();
      }
    });
  }
}