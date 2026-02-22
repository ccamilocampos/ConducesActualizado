import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface SnackData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-conduces-snack',
  standalone: true,
  imports: [MatIcon, CommonModule],
  template: `
    <div class="cs-inner cs-{{ data.type }}">
      <div class="cs-icon-wrap">
        <mat-icon>{{ icons[data.type] }}</mat-icon>
      </div>
      <div class="cs-text">
        <span class="cs-title">{{ data.title }}</span>
        <span class="cs-message">{{ data.message }}</span>
      </div>
      <button class="cs-close" (click)="ref.dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `
})
export class ConducesSnackComponent {
  icons = {
    success: 'check_circle',
    error:   'error',
    warning: 'warning',
    info:    'info'
  };

  constructor(
    public ref: MatSnackBarRef<ConducesSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackData
  ) {}
}
