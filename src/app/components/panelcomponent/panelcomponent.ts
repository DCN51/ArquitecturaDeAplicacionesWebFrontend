import { Component } from '@angular/core';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-panelcomponent',
  imports: [Menucomponent],
  templateUrl: './panelcomponent.html',
  styleUrl: './panelcomponent.css',
})
export class Panelcomponent {
  constructor(public loginService: Loginservice) { }
}
