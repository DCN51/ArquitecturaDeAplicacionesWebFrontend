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
import { Psicologocomponent } from './components/psicologocomponent/psicologocomponent';
import { Psicologolistcomponent } from './components/psicologocomponent/psicologolistcomponent/psicologolistcomponent';
import { Psicologocapacidadcomponent } from './components/psicologocomponent/psicologocapacidadcomponent/psicologocapacidadcomponent';
import { Psicologoasignarcomponent } from './components/psicologocomponent/psicologoasignarcomponent/psicologoasignarcomponent';
import { Reportpacientesporpsicologocomponent } from './components/reportcomponent/reportpacientesporpsicologocomponent/reportpacientesporpsicologocomponent';
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
      { path: 'listar', component: Catalogoplanlistcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] } },
      { path: 'insertar', component: Catalogoplaninsertcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'editar/:id', component: Catalogoplanupdatecomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'suscripciones',
    component: Suscripcioncomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'contratar', component: Suscripcioninsertcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'historial', component: Suscripcionhistorialcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE', 'ADMINISTRADOR'] } },
      { path: 'cambiar-plan', component: Suscripcioncambiarcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'por-vencer', component: Suscripcionporvencercomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'sesiones',
    component: Sesionclinicacomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'iniciar', component: Sesionclinicainsertcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'historial', component: Sesionclinicahistorialcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'finalizar/:id', component: Sesionclinicafinalizarcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'derivaciones', component: Sesionclinicaderivacionescomponent, canActivate: [roleGuard], data: { roles: ['PSICOLOGO'] } },
      { path: 'chat/:id', component: Sesionclinicachatcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
    ],
  },
  {
    path: 'diagnosticos',
    component: Diagnosticoclinicocomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
      { path: 'insertar', component: Diagnosticoclinicoinsertcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'insertar/:sesionId', component: Diagnosticoclinicoinsertcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
      { path: 'historial', component: Diagnosticoclinicohistorialcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] } },
      { path: 'pendientes', component: Diagnosticoclinicopendientescomponent, canActivate: [roleGuard], data: { roles: ['PSICOLOGO', 'ADMINISTRADOR'] } },
      { path: 'validados', component: Diagnosticoclinicovalidadoscomponent, canActivate: [roleGuard], data: { roles: ['PSICOLOGO', 'ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'roles',
    component: Rolecomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Rolelistcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'usuarios',
    component: Userscomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Userslistcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'editar/:id', component: Usersupdatecomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'psicologos',
    component: Psicologocomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Psicologolistcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'capacidad/:id', component: Psicologocapacidadcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'asignar', component: Psicologoasignarcomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'perfil',
    component: Userscomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] },
    children: [
      { path: '', component: Usersupdatecomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE', 'PSICOLOGO', 'ADMINISTRADOR'] } },
    ],
  },
  {
    path: 'actividades',
    component: Actividadcomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE', 'PSICOLOGO'] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Actividadlistcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE', 'PSICOLOGO'] } },
      { path: 'insertar', component: Actividadinsertcomponent, canActivate: [roleGuard], data: { roles: ['PSICOLOGO'] } },
      { path: 'editar/:userId/:id', component: Actividadupdatecomponent, canActivate: [roleGuard], data: { roles: ['PSICOLOGO'] } },
      { path: 'completar/:id', component: Actividadcompletarcomponent, canActivate: [roleGuard], data: { roles: ['PACIENTE'] } },
    ],
  },
  {
    path: 'reportes',
    component: Reportcomponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'suscriptores-por-plan', pathMatch: 'full' },
      { path: 'suscriptores-por-plan', component: Reportsuscripcioncomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'pacientes-por-psicologo', component: Reportpacientesporpsicologocomponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  { path: '**', redirectTo: '' },
];