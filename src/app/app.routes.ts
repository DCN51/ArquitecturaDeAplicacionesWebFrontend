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
    path: 'roles',
    component: Rolecomponent,
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Rolelistcomponent },
    ],
  },
  {
    path: 'usuarios',
    component: Userscomponent,
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Userslistcomponent },
      { path: 'editar/:id', component: Usersupdatecomponent },
    ],
  },
    {
    path: 'actividades',
    component: Actividadcomponent,
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Actividadlistcomponent },
      { path: 'insertar', component: Actividadinsertcomponent },
      { path: 'editar/:userId/:id', component: Actividadupdatecomponent },
      { path: 'completar/:userId/:id', component: Actividadcompletarcomponent },
    ],
  },
];