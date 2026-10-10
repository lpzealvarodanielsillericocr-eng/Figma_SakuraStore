import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { OpcionMenu } from '../../models/producto.model';
import { BotonComponent } from '../boton/boton.component';
import { NombreIcono } from '../icono/icono.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [BotonComponent],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  @Input() seleccion: OpcionMenu = 'todos';
  @Output() seleccionar = new EventEmitter<OpcionMenu>();
  readonly opciones: { valor: OpcionMenu; texto: string; icono: NombreIcono }[] = [
    { valor: 'todos', texto: 'Todos los productos', icono: 'caja' },
    { valor: 'bajo', texto: 'Stock bajo', icono: 'alerta' },
    { valor: 'nuevo', texto: 'Añadir producto', icono: 'mas' },
    { valor: 'ayuda', texto: 'Ayuda', icono: 'ayuda' }
  ];
}
