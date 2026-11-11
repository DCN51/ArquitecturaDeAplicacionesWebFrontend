import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-userscomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './userscomponent.html',
  styleUrl: './userscomponent.css',
})
export class Userscomponent {}

