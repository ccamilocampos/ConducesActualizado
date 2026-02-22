import { Component, ViewChild } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators, NgForm, FormGroup} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { ConducesSnackComponent } from '../../shared/conduces-snack/conduces-snack';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../../environments/enviroment';
import { CatalogDetail } from '../../../core/models/catalog-detail';
import {MatOption, MatSelect} from '@angular/material/select';
import { OnInit } from '@angular/core';

const baseUrl = `${environment.apiUrl}/vehicles`;
const baseUrlGeneral = `${environment.apiUrl}`;


@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIcon,
    MatSelect,
    MatOption
  ],
  templateUrl: './create-vehicle.html',
  styleUrls: ['./create-vehicle.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateVehicleComponent implements OnInit{

  models: CatalogDetail[] = [];
  //variables
  isUpdateMode = false;
  vehicleId: number | null = null;

  @ViewChild('formDir') formDir!: NgForm;  // NECESARIO PARA QUITAR LOS CAMPOS MARCADOS COMO SI ESTUVIERAN VACIOS DESPUES DE GRABAR

  errorMessage = '';
  form: FormGroup;

// centralizamos el snack para que no repetir mucho código
  private showSnack(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.snackBar.openFromComponent(ConducesSnackComponent, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'cs-panel',
      data: { title, message, type }
    });
  }

  private resetFormState() {
    setTimeout(() => {
      this.form.reset();
      this.formDir.resetForm();
      this.isUpdateMode = false;
      this.vehicleId = null;
      this.form.get('plate')?.enable();
    }, 100);
    this.errorMessage = '';
  }




  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    //  Primero inicializar el formulario
    this.form = this.fb.group({
      plate: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(2100)
      ]]
    });

    //  Con esto hace un "lostfocus" en el campo de placa, trayendo la información especificada en el checkPlate
    this.form.get('plate')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        if (value && value.length >= 3) {
          this.checkPlate(value);
        }
      });
  }



  ngOnInit() {
    this.loadModels();
  }

  submit() {
    if (this.form.invalid) return;

    const url = this.isUpdateMode && this.vehicleId
      ? `${baseUrl}/${this.vehicleId}`
      : baseUrl;

    const request$ = this.isUpdateMode && this.vehicleId
      ? this.http.put(url, this.form.value)
      : this.http.post(url, this.form.value);

    const successTitle = this.isUpdateMode ? '¡Vehículo actualizado!' : '¡Vehículo registrado!';
    const successMsg   = this.isUpdateMode ? 'La unidad fue actualizada exitosamente.' : 'La unidad fue guardada exitosamente.';

    request$.subscribe({
      next: () => {
        this.showSnack(successTitle, successMsg, 'success');
        this.resetFormState();
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error inesperado';
        this.showSnack('Error al guardar', mensaje, 'error');
        this.errorMessage = mensaje;
      }
    });
  }



  checkPlate(plate: string) {

    this.http.get<any>(`${baseUrl}/plate/${plate}`)
      .subscribe({
        next: (vehicle) => {

          this.isUpdateMode = true;
          this.vehicleId = vehicle.id;

          this.form.patchValue({
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year
          });

        },
        error: () => {
          this.isUpdateMode = false;
          this.vehicleId = null;
        }
      });
  }

  resetForm() {

    this.form.reset();

    this.isUpdateMode = false;
    this.vehicleId = null;


    this.form.get('plate')?.enable();

  }

  loadModels() {
    this.http
      .get<CatalogDetail[]>(`${baseUrlGeneral}/catalogs/MODELOS`)
      .subscribe(data => {
        this.models = data;
      });
  }


}
