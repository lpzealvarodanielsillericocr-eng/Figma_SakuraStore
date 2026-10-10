import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IconoComponent, NombreIcono } from '../icono/icono.component';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [IconoComponent],
  templateUrl: './boton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotonComponent {
  @Input() texto = '';
  @Input() icono?: NombreIcono;
  @Input() variante: 'principal' | 'secundario' | 'menu' = 'secundario';
  @Input() tipo: 'button' | 'submit' = 'button';
  @Input() etiqueta = '';
  @Input() activo = false;
  @Input() deshabilitado = false;
  @Output() accion = new EventEmitter<void>();
}
