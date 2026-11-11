import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';

@Component({
  selector: 'app-rolelistcomponent',
  imports: [MatTableModule],
  templateUrl: './rolelistcomponent.html',
  styleUrl: './rolelistcomponent.css',
})
export class Rolelistcomponent implements OnInit {
  dataSource: RoleDTO[] = [];
  displayedColumns: string[] = ['id', 'nombre'];
  mensaje: string = '';

  constructor(private rS: Roleservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.rS.getRoles().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al obtener los roles';
        this.cdr.detectChanges();
      }
    });
  }

  // "ROLE_PACIENTE" -> "PACIENTE"
  nombreRol(nombre: string): string {
    return nombre.replace('ROLE_', '');
  }
}