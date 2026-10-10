import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { InventarioService } from './services/inventario.service';
import { OpcionMenu } from './models/producto.model';
import { BarraTituloComponent } from './components/barra-titulo/barra-titulo.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { TablaProductosComponent } from './components/tabla-productos/tabla-productos.component';
import { FormularioProductoComponent } from './components/formulario-producto/formulario-producto.component';
import { BotonComponent } from './components/boton/boton.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarraTituloComponent, MenuComponent, NavegacionComponent, TablaProductosComponent, FormularioProductoComponent, BotonComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly inventario = inject(InventarioService);
  readonly seleccion = signal<OpcionMenu>('todos');
  readonly busqueda = signal('');
  readonly historial = signal<OpcionMenu[]>([]);
  @ViewChild(TablaProductosComponent) tabla?: TablaProductosComponent;
  @ViewChild(FormularioProductoComponent) formulario?: FormularioProductoComponent;
  readonly productosVisibles = computed(() => {
    const texto = this.busqueda().trim().toLocaleLowerCase('es');
    return this.inventario.productos().filter(producto => {
      const coincide = `${producto.codigo} ${producto.nombre}`.toLocaleLowerCase('es').includes(texto);
      const stockCorrecto = this.seleccion() !== 'bajo' || producto.stock < producto.stockMinimo;
      return coincide && stockCorrecto;
    });
  });

  seleccionar(opcion: OpcionMenu): void {
    if (opcion !== this.seleccion()) {
      this.historial.update(historial => [...historial, this.seleccion()]);
      this.seleccion.set(opcion);
    }
    if (opcion === 'nuevo') {
      this.formulario?.enfocarCodigo();
    }
  }
  inicio(): void {
    this.seleccionar('todos');
    this.tabla?.limpiarBusqueda();
  }
  volver(): void {
    const historial = this.historial();
    const anterior = historial.at(-1);
    if (!anterior) return;
    this.historial.set(historial.slice(0, -1));
    this.seleccion.set(anterior);
    if (anterior === 'nuevo') this.formulario?.enfocarCodigo();
  }
  productoGuardado(): void { this.inicio(); }
}
