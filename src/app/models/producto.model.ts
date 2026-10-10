export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
}

export type NuevoProducto = Omit<Producto, 'id' | 'stock'>;
export type OpcionMenu = 'todos' | 'bajo' | 'nuevo' | 'ayuda';
