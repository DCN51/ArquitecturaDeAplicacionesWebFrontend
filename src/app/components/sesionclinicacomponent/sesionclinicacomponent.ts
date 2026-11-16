import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-sesionclinicacomponent',
  imports: [RouterOutlet, Menucomponent],
  templateUrl: './sesionclinicacomponent.html',
  styleUrl: './sesionclinicacomponent.css',
})
export class Sesionclinicacomponent {}
