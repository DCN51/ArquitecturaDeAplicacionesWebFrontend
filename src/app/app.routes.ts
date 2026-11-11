import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Catalogoplancomponent } from './components/catalogoplancomponent/catalogoplancomponent';
import { Catalogoplanlistcomponent } from './components/catalogoplancomponent/catalogoplanlistcomponent/catalogoplanlistcomponent';
import { Catalogoplaninsertcomponent } from './components/catalogoplancomponent/catalogoplaninsertcomponent/catalogoplaninsertcomponent';
import { Catalogoplanupdatecomponent } from './components/catalogoplancomponent/catalogoplanupdatecomponent/catalogoplanupdatecomponent';
import { Suscripcioncomponent } from './components/suscripcioncomponent/suscripcioncomponent';
import { Suscripcioninsertcomponent } from './components/suscripcioncomponent/suscripcioninsertcomponent/suscripcioninsertcomponent';
import { Suscripcionhistorialcomponent } from './components/suscripcioncomponent/suscripcionhistorialcomponent/suscripcionhistorialcomponent';
import { Suscripcioncambiarcomponent } from './components/suscripcioncomponent/suscripcioncambiarcomponent/suscripcioncambiarcomponent';
import { Sesionclinicacomponent } from './components/sesionclinicacomponent/sesionclinicacomponent';
import { Sesionclinicainsertcomponent } from './components/sesionclinicacomponent/sesionclinicainsertcomponent/sesionclinicainsertcomponent';
import { Sesionclinicahistorialcomponent } from './components/sesionclinicacomponent/sesionclinicahistorialcomponent/sesionclinicahistorialcomponent';
import { Sesionclinicafinalizarcomponent } from './components/sesionclinicacomponent/sesionclinicafinalizarcomponent/sesionclinicafinalizarcomponent';
import { Sesionclinicaderivacionescomponent } from './components/sesionclinicacomponent/sesionclinicaderivacionescomponent/sesionclinicaderivacionescomponent';
import { Diagnosticoclinicocomponent } from './components/diagnosticoclinicocomponent/diagnosticoclinicocomponent';
import { Diagnosticoclinicoinsertcomponent } from './components/diagnosticoclinicocomponent/diagnosticoclinicoinsertcomponent/diagnosticoclinicoinsertcomponent';
import { Diagnosticoclinicohistorialcomponent } from './components/diagnosticoclinicocomponent/diagnosticoclinicohistorialcomponent/diagnosticoclinicohistorialcomponent';
import { Diagnosticoclinicopendientescomponent } from './components/diagnosticoclinicocomponent/diagnosticoclinicopendientescomponent/diagnosticoclinicopendientescomponent';
import { Diagnosticoclinicovalidadoscomponent } from './components/diagnosticoclinicocomponent/diagnosticoclinicovalidadoscomponent/diagnosticoclinicovalidadoscomponent';

export const routes: Routes = [
  {
    path: '',
    component: Homecomponent,
  },
  {
    path: 'planes',
    component: Catalogoplancomponent,
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Catalogoplanlistcomponent },
      { path: 'insertar', component: Catalogoplaninsertcomponent },
      { path: 'editar/:id', component: Catalogoplanupdatecomponent },
    ],
  },
  
  {
    path: 'suscripciones',
    component: Suscripcioncomponent,
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'contratar', component: Suscripcioninsertcomponent },
      { path: 'historial', component: Suscripcionhistorialcomponent },
      { path: 'cambiar-plan', component: Suscripcioncambiarcomponent },
    ],
  },
  {
    path: 'sesiones',
    component: Sesionclinicacomponent,
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'iniciar', component: Sesionclinicainsertcomponent },
      { path: 'historial', component: Sesionclinicahistorialcomponent },
      { path: 'finalizar/:id', component: Sesionclinicafinalizarcomponent },
      { path: 'derivaciones', component: Sesionclinicaderivacionescomponent },
    ],
  },
  {
    path: 'diagnosticos',
    component: Diagnosticoclinicocomponent,
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'insertar', component: Diagnosticoclinicoinsertcomponent },
      { path: 'insertar/:sesionId', component: Diagnosticoclinicoinsertcomponent },
      { path: 'historial', component: Diagnosticoclinicohistorialcomponent },
      { path: 'pendientes', component: Diagnosticoclinicopendientescomponent },
      { path: 'validados', component: Diagnosticoclinicovalidadoscomponent },
    ],
  },
];