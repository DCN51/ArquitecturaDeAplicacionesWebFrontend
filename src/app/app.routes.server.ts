import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sesiones/finalizar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'diagnosticos/insertar/:sesionId',
    renderMode: RenderMode.Client
  },
  {
    path: 'sesiones/derivaciones',
    renderMode: RenderMode.Client
  },
  {
    path: 'diagnosticos/pendientes',
    renderMode: RenderMode.Client
  },
  {
    path: 'planes/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
