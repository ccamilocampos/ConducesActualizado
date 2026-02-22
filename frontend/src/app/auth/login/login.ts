import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Invalid credentials';
        }
      });
  }
}
