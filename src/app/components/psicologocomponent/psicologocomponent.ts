import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-psicologocomponent',
  imports: [RouterOutlet, Menucomponent],
  templateUrl: './psicologocomponent.html',
  styleUrl: './psicologocomponent.css',
})
export class Psicologocomponent {}
