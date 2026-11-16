import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-diagnosticoclinicocomponent',
  imports: [RouterOutlet, Menucomponent],
  templateUrl: './diagnosticoclinicocomponent.html',
  styleUrl: './diagnosticoclinicocomponent.css',
})
export class Diagnosticoclinicocomponent {}
