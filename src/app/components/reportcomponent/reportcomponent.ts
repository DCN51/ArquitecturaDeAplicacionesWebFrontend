import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-reportcomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './reportcomponent.html',
  styleUrl: './reportcomponent.css',
})
export class Reportcomponent {}