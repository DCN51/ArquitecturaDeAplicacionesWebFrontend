import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-actividadcomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './actividadcomponent.html',
  styleUrl: './actividadcomponent.css',
})
export class Actividadcomponent {}