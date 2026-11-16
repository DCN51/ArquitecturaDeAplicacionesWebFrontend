
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-homecomponent',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent {

  recursos = [
    {
      icono: 'chat',
      nombre: 'Sesiones clínicas con IA',
      ruta: '/iniciar-sesion',
      color: 'azul'
    },
    {
      icono: 'history',
      nombre: 'Historial de sesiones',
      ruta: '/iniciar-sesion',
      color: 'naranja'
    },
    {
      icono: 'psychology',
      nombre: 'Evaluaciones preliminares',
      ruta: '/iniciar-sesion',
      color: 'morado'
    },
    {
      icono: 'verified',
      nombre: 'Validación psicológica',
      ruta: '/iniciar-sesion',
      color: 'rosa'
    },
    {
      icono: 'spa',
      nombre: 'Actividades recomendadas',
      ruta: '/',
      fragmento: 'actividades',
      color: 'amarillo'
    },
    {
      icono: 'subscriptions',
      nombre: 'Planes y suscripciones',
      ruta: '/planes/listar',
      color: 'celeste'
    }
  ];

  pasos = [
    {
      numero: '01',
      titulo: 'Sesión con IA',
      descripcion:
        'Conversa y expresa tus emociones en un espacio de apoyo.',
      etiqueta: 'CONVERSACIÓN INICIAL'
    },
    {
      numero: '02',
      titulo: 'Evaluación preliminar',
      descripcion:
        'Identificamos señales emocionales y el nivel de atención requerido.',
      etiqueta: 'EVALUACIÓN DE APOYO'
    },
    {
      numero: '03',
      titulo: 'Revisión del psicólogo',
      descripcion:
        'Un profesional revisa y valida las evaluaciones correspondientes.',
      etiqueta: 'VALIDACIÓN PROFESIONAL'
    }
  ];

  recorrido = [
    {
      numero: '01',
      titulo: 'Cuéntanos cómo te sientes',
      imagen: '',
      color: 'rosa'
    },
    {
      numero: '02',
      titulo: 'Habla con la IA a tu ritmo',
      imagen: '/conversacion.png',
      color: 'amarillo'
    },
    {
      numero: '03',
      titulo: 'Recibe orientación preliminar',
      imagen: '',
      color: 'celeste'
    },
    {
      numero: '04',
      titulo: 'Acompañamiento profesional',
      imagen: '/landing/psicologo.png',
      color: 'lila'
    },
    {
      numero: '05',
      titulo: 'Continúa cuidando de ti',
      imagen: '/cuaderno.png',
      color: 'durazno'
    }
  ];

  beneficios: string[] = [
    'Sesiones de conversación con IA',
    'Historial de sesiones',
    'Evaluaciones preliminares',
    'Seguimiento de bienestar',
    'Actividades recomendadas',
    'Derivación cuando sea necesaria'
  ];

}
