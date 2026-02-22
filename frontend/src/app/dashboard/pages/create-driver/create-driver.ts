import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators, NgForm, FormGroup} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {environment} from '../../../../environments/enviroment';
import {ConducesSnackComponent} from '../../shared/conduces-snack/conduces-snack';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import { MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {CatalogDetail} from '../../../core/models/catalog-detail';


const baseUrl = `${environment.apiUrl}/drivers`;
const baseUrlGeneral = `${environment.apiUrl}`;

@Component({
  selector: 'app-create-driver',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIcon,
    NgIf,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './create-driver.html',
  styleUrls: ['./create-driver.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateDriverComponent implements OnInit {

  @ViewChild('formDir') formDir!: NgForm;
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

  //variables
  isUpdateMode = false;
  driverId: number | null = null;
  models: CatalogDetail[] = [];


  //Definición de limites para el calendario
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  errorMessage = '';
  form: FormGroup;   // solo declaración

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
) {
    this.form = this.fb.group({
      identification: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),   // solo números
          Validators.maxLength(12)
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/), // solo letras y espacios
          Validators.maxLength(50)
        ]
      ],
      year_born: ['', Validators.required],
      year_id: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/), // solo números
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ],
      type_id: ['', Validators.required]
    });

    this.form.get('identification')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        if (value && value.length >= 6) {
          this.checkDriver(value);
        }
      });
  }

ngOnInit() {
  this.loadModels();
}
  submit() {
    if (this.form.invalid) return;

    const url = this.isUpdateMode && this.driverId
    ? `${baseUrl}/${this.driverId}`
      : baseUrl


    const request$ = this.isUpdateMode && this.driverId
    ? this.http.put(url, this.form.value)
      : this.http.post(url, this.form.value)

    const sucessTitle = this.isUpdateMode? 'Conductor actualizado' : 'Condutor registrado';
    const sucessMsg = this.isUpdateMode? 'Se ha actualizado el conductor' : 'Se ha registrado el conductor';


    request$.subscribe({
      next: () => {
        this.showSnack(sucessTitle, sucessMsg, 'success')
        this.resetForm()
      },
      error:(err) => {
        const mensaje = err.error?.message || 'Error inesperado';
        const mensajeSeguro = this.mapBackendError(mensaje);
        this.showSnack('Error al guardar', mensajeSeguro, 'error');
        this.errorMessage = mensaje;
      }
    })

  }


  checkDriver(id: string) {

    this.http.get<any>(`${baseUrl}/id/${id}`)
      .subscribe({
        next: (driver) => {

          this.isUpdateMode = true;
          this.driverId = driver.identification;

          this.form.patchValue({
            name: driver.name,
            year_born: driver.year_born,
            year_id: driver.year_id,
            type_id: driver.type_id
          });

        },
        error: () => {
          this.isUpdateMode = false;
          this.driverId = null;
        }
      });
  }


  resetForm() {
    this.form.reset({}, { emitEvent: false });

    this.form.get('identification')?.enable();

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    this.isUpdateMode = false;
    this.driverId = null;

  }

  loadModels() {
    this.http
      .get<CatalogDetail[]>(`${baseUrlGeneral}/catalogs/TIPOS DE IDENTIFICACION`)
      .subscribe(data => {
        this.models = data;
      });
  }



  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const pattern = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
  private mapBackendError(message: string): string {

    if (message.includes('year_id')) {
      return 'El año de identificación debe ser mayor o igual a 1900';
    }

    if (message.includes('identification')) {
      return 'La cédula no es válida';
    }

    if (message.includes('name')) {
      return 'El nombre no es válido';
    }

    return 'Ocurrió un error al guardar la información';
  }
}

