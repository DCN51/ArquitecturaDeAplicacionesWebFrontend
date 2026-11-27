import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';


@Component({
  selector: 'app-catalogoplancomponent',
  imports: [RouterOutlet,Menucomponent],
  templateUrl: './catalogoplancomponent.html',
  styleUrl: './catalogoplancomponent.css',
})
export class Catalogoplancomponent {}
