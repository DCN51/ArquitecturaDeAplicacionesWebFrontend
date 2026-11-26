import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PacientesPorPsicologoDTO } from '../../../models/PacientesPorPsicologoDTO';
import { Asignacionpacienteservice } from '../../../services/asignacionpacienteservice';

@Component({
  selector: 'app-reportpacientesporpsicologocomponent',
  imports: [BaseChartDirective],
  templateUrl: './reportpacientesporpsicologocomponent.html',
  styleUrl: './reportpacientesporpsicologocomponent.css',
})
export class Reportpacientesporpsicologocomponent implements OnInit {
  lista: PacientesPorPsicologoDTO[] = [];
  mensaje: string = '';

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Pacientes asignados',
        data: [],
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Pacientes asignados por psicólogo'
      }
    }
  };

  constructor(private aS: Asignacionpacienteservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  obtenerReporte(): void {
    this.aS.pacientesPorPsicologo().subscribe({
      next: (data: PacientesPorPsicologoDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'No hay psicólogos registrados';
        this.chartData = {
          labels: data.map(item => item.nombrePsicologo),
          datasets: [
            {
              label: 'Pacientes asignados',
              data: data.map(item => item.cantidadPacientes),
              backgroundColor: '#1aab8b',
              borderWidth: 1
            }
          ]
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener el reporte';
        this.cdr.detectChanges();
      }
    });
  }
}
