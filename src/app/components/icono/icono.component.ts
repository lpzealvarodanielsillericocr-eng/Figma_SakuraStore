import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type NombreIcono = 'flor' | 'caja' | 'alerta' | 'mas' | 'ayuda' | 'inicio' | 'volver' | 'buscar' | 'guardar' | 'cerrar';

@Component({
  selector: 'app-icono',
  standalone: true,
  templateUrl: './icono.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconoComponent {
  @Input() nombre: NombreIcono = 'caja';
  readonly trazos: Record<NombreIcono, string> = {
    flor: 'M12 21V12M12 15C5 15 3 9 6 8c3-1 6 4 6 7ZM12 17c6-1 9-6 6-8-3-1-6 4-6 8ZM12 12c-5-3-4-9-1-9 4 0 6 5 1 9Z',
    caja: 'M12 3 3 8v9l9 5 9-5V8L12 3ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5',
    alerta: 'M12 3 2 21h20L12 3ZM12 9v5M12 17h.01',
    mas: 'M12 4v16M4 12h16',
    ayuda: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01',
    inicio: 'M3 11 12 3l9 8M5 9v12h14V9M9 21v-7h6v7',
    volver: 'M20 12H4M10 6l-6 6 6 6',
    buscar: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM15 15l6 6',
    guardar: 'M3 3h15l3 3v15H3V3ZM7 3v7h10V3M7 21v-7h10v7',
    cerrar: 'M6 6l12 12M18 6 6 18'
  };
}
