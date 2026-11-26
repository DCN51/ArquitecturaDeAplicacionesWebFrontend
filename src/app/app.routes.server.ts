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
    path: 'psicologos/capacidad/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Client
  },
  {
    path: 'usuarios/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'actividades/editar/:userId/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'actividades/completar/:id',
    renderMode: RenderMode.Client
  },
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: '**',
    renderMode: RenderMode.Client
  },
  {
    path: 'sesiones/chat/:id',
    renderMode: RenderMode.Client
  },
];
