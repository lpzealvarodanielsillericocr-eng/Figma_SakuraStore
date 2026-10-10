import { Injectable, signal } from '@angular/core';
import { NuevoProducto, Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  readonly categorias = ['Hogar', 'Papelería', 'Arte', 'Accesorios'];
  private siguienteId = 7;
  private readonly datos = signal<Producto[]>([
    { id: 2, codigo: 'SK-001', nombre: 'Cuaderno Sakura', categoria: 'Papelería', precio: 45, stock: 82, stockMinimo: 30 },
    { id: 3, codigo: 'SK-014', nombre: 'Set de marcadores pastel', categoria: 'Arte', precio: 72, stock: 24, stockMinimo: 30 },
    { id: 4, codigo: 'SK-027', nombre: 'Taza floral', categoria: 'Hogar', precio: 65, stock: 48, stockMinimo: 30 },
    { id: 5, codigo: 'SK-032', nombre: 'Bolígrafo gel rosa', categoria: 'Papelería', precio: 12, stock: 18, stockMinimo: 30 },
    { id: 6, codigo: 'SK-045', nombre: 'Bolsa de tela Sakura', categoria: 'Accesorios', precio: 58, stock: 37, stockMinimo: 30 }
  ]);
  readonly productos = this.datos.asReadonly();

  guardar(datos: NuevoProducto): boolean {
    const codigo = datos.codigo.trim().toUpperCase();
    if (this.datos().some(producto => producto.codigo === codigo)) {
      return false;
    }
    const producto: Producto = {
      ...datos,
      codigo,
      nombre: datos.nombre.trim(),
      id: this.siguienteId++,
      stock: 0
    };
    this.datos.update(productos => [producto, ...productos]);
    return true;
  }
}
