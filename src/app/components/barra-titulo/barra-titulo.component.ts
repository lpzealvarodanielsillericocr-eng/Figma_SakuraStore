import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-barra-titulo',
  standalone: true,
  templateUrl: './barra-titulo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarraTituloComponent {}
