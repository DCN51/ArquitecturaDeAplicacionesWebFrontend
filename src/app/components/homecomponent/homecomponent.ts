
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homecomponent',
  imports: [RouterLink],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent {

  recursos = [
    {
      icono: '💬',
      nombre: 'Sesiones clínicas con IA',
      ruta: '/sesiones/iniciar',
      color: 'azul'
    },
    {
      icono: '📋',
      nombre: 'Historial de sesiones',
      ruta: '/sesiones/historial',
      color: 'naranja'
    },
    {
      icono: '✦',
      nombre: 'Evaluaciones preliminares',
      ruta: '/diagnosticos/historial',
      color: 'morado'
    },
    {
      icono: '✓',
      nombre: 'Validación psicológica',
      ruta: '/diagnosticos/validados',
      color: 'rosa'
    },
    {
      icono: '🌼',
      nombre: 'Actividades recomendadas',
      ruta: '/#actividades',
      color: 'amarillo'
    },
    {
      icono: '▣',
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

  beneficios = [
    'Sesiones de conversación con IA',
    'Historial de sesiones',
    'Evaluaciones preliminares',
    'Seguimiento de bienestar',
    'Actividades recomendadas',
    'Derivación cuando sea necesaria'
  ];

}
