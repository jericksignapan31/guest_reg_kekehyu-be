import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);

  open<T>(component: ComponentType<T>, data?: any, options?: any) {
    return this.dialog.open(component, {
      width: options?.width || '500px',
      data,
      ...options
    });
  }

  close(result?: any): void {
    this.dialog.closeAll();
  }
}
