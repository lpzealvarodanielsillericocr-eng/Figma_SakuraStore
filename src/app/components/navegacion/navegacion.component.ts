import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonComponent } from '../boton/boton.component';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [BotonComponent],
  templateUrl: './navegacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavegacionComponent {
  @Input() puedeVolver = false;
  @Output() inicio = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();
}
