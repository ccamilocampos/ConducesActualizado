import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { LayoutComponent } from './dashboard/layout/layout';
import { HomeComponent } from './dashboard/pages/home/home';
import { authGuard } from './core/guards/auth-guard';
import { CreateVehicleComponent } from './dashboard/pages/create-vehicle/create-vehicle';
import { CreateDriverComponent } from './dashboard/pages/create-driver/create-driver';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'create-vehicle', component: CreateVehicleComponent },
      { path: 'create-driver', component: CreateDriverComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }

];


