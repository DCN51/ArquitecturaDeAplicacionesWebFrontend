import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-casoemergenciacomponent',
  imports: [RouterOutlet, Menucomponent],
  templateUrl: './casoemergenciacomponent.html',
  styleUrl: './casoemergenciacomponent.css',
})
export class Casoemergenciacomponent {}
