import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { SuscriptoresPorPlanDTO } from '../../../models/SuscriptoresPorPlanDTO';
import { Suscripcionservice } from '../../../services/suscripcionservice';
type TipoGrafico = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar';

@Component({
  selector: 'app-reportsuscripcioncomponent',
  imports: [BaseChartDirective],
  templateUrl: './reportsuscripcioncomponent.html',
  styleUrl: './reportsuscripcioncomponent.css',
})
export class Reportsuscripcioncomponent implements OnInit {
  lista: SuscriptoresPorPlanDTO[] = [];
  mensaje: string = '';

  public chartType: TipoGrafico = 'bar';

  public chartData: ChartData<TipoGrafico> = {
    labels: [],
    datasets: [
      {
        label: 'Suscriptores activos',
        data: [],
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Suscriptores activos por plan'
      }
    }
  };

  constructor(private sS: Suscripcionservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerTotal();
  }

  obtenerTotal(): void {
    this.sS.suscriptoresPorPlan().subscribe({
      next: (data: SuscriptoresPorPlanDTO[]) => {
        this.lista = data;
        this.mensaje = '';
        this.chartData = {
          labels: data.map(item => item.nombrePlan),
          datasets: [
            {
              label: 'Suscriptores activos',
              data: data.map(item => item.cantidadSuscriptores),
              backgroundColor: ['#1aab8b', '#3cc4a3', '#7fd8c2', '#f5c842', '#9e9e9e'],
              borderWidth: 1
            }
          ]
        };
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar!!!', error);
        this.mensaje = 'Ocurrió un error al obtener el reporte';
        this.cdr.detectChanges();
      }
    });
  }
}