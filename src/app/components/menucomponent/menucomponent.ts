import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-menucomponent',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {
  constructor(public loginService: Loginservice, private router: Router) { }

  cerrarSesion(): void {
    this.loginService.logout();
    void this.router.navigate(['/']);
  }
}
