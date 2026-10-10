import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Producto } from '../../models/producto.model';
import { CampoComponent } from '../campo/campo.component';
import { IconoComponent } from '../icono/icono.component';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [DecimalPipe, ReactiveFormsModule, CampoComponent, IconoComponent],
  templateUrl: './tabla-productos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaProductosComponent {
  @Input() productos: readonly Producto[] = [];
  @Input() soloBajos = false;
  @Output() buscar = new EventEmitter<string>();
  readonly busqueda = new FormControl('', { nonNullable: true });

  constructor() {
    this.busqueda.valueChanges.pipe(takeUntilDestroyed()).subscribe(valor => this.buscar.emit(valor));
  }
  limpiarBusqueda(): void { this.busqueda.reset(''); }
}
