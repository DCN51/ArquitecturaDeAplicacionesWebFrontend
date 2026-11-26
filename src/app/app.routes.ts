import { Routes } from '@angular/router';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Registrercomponent } from './components/registrercomponent/registrercomponent';
import { Panelcomponent } from './components/panelcomponent/panelcomponent';
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
import { Rolecomponent } from './components/rolecomponent/rolecomponent';
import { Rolelistcomponent } from './components/rolecomponent/rolelistcomponent/rolelistcomponent';
import { Userscomponent } from './components/userscomponent/userscomponent';
import { Userslistcomponent } from './components/userscomponent/userslistcomponent/userslistcomponent';
import { Usersupdatecomponent } from './components/userscomponent/usersupdatecomponent/usersupdatecomponent';
import { Actividadcomponent } from './components/actividadcomponent/actividadcomponent';
import { Actividadlistcomponent } from './components/actividadcomponent/actividadlistcomponent/actividadlistcomponent';
import { Actividadinsertcomponent } from './components/actividadcomponent/actividadinsertcomponent/actividadinsertcomponent';
import { Actividadupdatecomponent } from './components/actividadcomponent/actividadupdatecomponent/actividadupdatecomponent';
import { Actividadcompletarcomponent } from './components/actividadcomponent/actividadcompletarcomponent/actividadcompletarcomponent';
import { Suscripcionporvencercomponent } from './components/suscripcioncomponent/suscripcionporvencercomponent/suscripcionporvencercomponent';
import { Reportcomponent } from './components/reportcomponent/reportcomponent';
import { Reportsuscripcioncomponent } from './components/reportcomponent/reportsuscripcioncomponent/reportsuscripcioncomponent';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Sesionclinicachatcomponent } from './components/sesionclinicacomponent/sesionclinicachatcomponent/sesionclinicachatcomponent';


export const routes: Routes = [
  { path: 'app', component: Panelcomponent, canActivate: [authGuard] },
  { path: 'iniciar-sesion', component: Logincomponent },
  { path: 'registrarse', component: Registrercomponent },
  {
    path: '',
    component: Homecomponent,
  },
  {
    path: 'planes',
    component: Catalogoplancomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] },
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
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'contratar', component: Suscripcioninsertcomponent },
      { path: 'historial', component: Suscripcionhistorialcomponent },
      { path: 'cambiar-plan', component: Suscripcioncambiarcomponent },
      { path: 'por-vencer', component: Suscripcionporvencercomponent },
    ],
  },
  {
    path: 'sesiones',
    component: Sesionclinicacomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'iniciar', component: Sesionclinicainsertcomponent },
      { path: 'historial', component: Sesionclinicahistorialcomponent },
      { path: 'finalizar/:id', component: Sesionclinicafinalizarcomponent },
      { path: 'derivaciones', component: Sesionclinicaderivacionescomponent },
      { path: 'chat/:id', component: Sesionclinicachatcomponent },
    ],
  },
  {
    path: 'diagnosticos',
    component: Diagnosticoclinicocomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'insertar', component: Diagnosticoclinicoinsertcomponent },
      { path: 'insertar/:sesionId', component: Diagnosticoclinicoinsertcomponent },
      { path: 'historial', component: Diagnosticoclinicohistorialcomponent },
      { path: 'pendientes', component: Diagnosticoclinicopendientescomponent },
      { path: 'validados', component: Diagnosticoclinicovalidadoscomponent },
    ],
  },
  {
    path: 'roles',
    component: Rolecomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Rolelistcomponent },
    ],
  },
  {
    path: 'usuarios',
    component: Userscomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Userslistcomponent },
      { path: 'editar/:id', component: Usersupdatecomponent },
    ],
  },
  {
    path: 'perfil',
    component: Userscomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] },
    children: [
      { path: '', component: Usersupdatecomponent },
    ],
  },
  {
    path: 'actividades',
    component: Actividadcomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Actividadlistcomponent },
      { path: 'insertar', component: Actividadinsertcomponent },
      { path: 'editar/:userId/:id', component: Actividadupdatecomponent },
      { path: 'completar/:id', component: Actividadcompletarcomponent },
    ],
  },
  {
    path: 'reportes',
    component: Reportcomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'suscriptores-por-plan', pathMatch: 'full' },
      { path: 'suscriptores-por-plan', component: Reportsuscripcioncomponent },
    ],
  },
  { path: '**', redirectTo: '' },
];