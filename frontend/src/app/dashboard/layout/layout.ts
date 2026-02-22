import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink  } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { NgIf } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {

  username: string | null = null;
  isAdmin = false;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.username = this.authService.getUsername();

    const roles = this.authService.getRoles();
    this.isAdmin = roles.includes('ROLE_ADMIN');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
