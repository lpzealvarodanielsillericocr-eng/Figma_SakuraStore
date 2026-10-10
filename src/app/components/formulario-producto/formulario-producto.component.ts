import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventarioService } from '../../services/inventario.service';
import { BotonComponent } from '../boton/boton.component';
import { CampoComponent } from '../campo/campo.component';
import { IconoComponent } from '../icono/icono.component';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [ReactiveFormsModule, BotonComponent, CampoComponent, IconoComponent],
  templateUrl: './formulario-producto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioProductoComponent {
  private readonly inventario = inject(InventarioService);
  private readonly fb = inject(FormBuilder);
  readonly categorias = this.inventario.categorias;
  readonly mensaje = signal('');
  @ViewChild('campoCodigo') campoCodigo?: CampoComponent;
  @Output() guardado = new EventEmitter<void>();
  readonly formulario = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{1,50}$/)]],
    nombre: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/.*\S.*/)]],
    categoria: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    stockMinimo: ['30', [Validators.required, Validators.min(30), Validators.pattern(/^\d+$/)]]
  });

  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.mensaje.set(''));
  }
  error(campo: keyof typeof this.formulario.controls): string {
    const control = this.formulario.controls[campo];
    if (!control.touched && !control.dirty) return '';
    if (control.hasError('duplicado')) return 'Este código ya existe. Usa otro.';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('min')) return campo === 'stockMinimo' ? 'El mínimo debe ser 30 o más.' : 'El precio debe ser mayor que cero.';
    if (control.hasError('maxlength')) return 'Usa como máximo 150 caracteres.';
    if (control.hasError('pattern')) {
      if (campo === 'codigo') return 'Usa letras, números, guion o guion bajo; máximo 50.';
      if (campo === 'precio') return 'Usa un precio con máximo dos decimales.';
      if (campo === 'stockMinimo') return 'Usa una cantidad entera.';
      return 'Escribe un nombre válido.';
    }
    return '';
  }
  guardar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;
    const datos = this.formulario.getRawValue();
    const guardado = this.inventario.guardar({
      codigo: datos.codigo,
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: Number(datos.precio),
      stockMinimo: Number(datos.stockMinimo)
    });
    if (!guardado) {
      this.formulario.controls.codigo.setErrors({ duplicado: true });
      this.enfocarCodigo();
      return;
    }
    this.limpiar();
    this.mensaje.set('Producto guardado correctamente. Stock inicial: 0.');
    this.guardado.emit();
  }
  limpiar(): void {
    this.formulario.reset({ codigo: '', nombre: '', categoria: '', precio: '', stockMinimo: '30' });
    this.mensaje.set('');
  }
  enfocarCodigo(): void { this.campoCodigo?.enfocar(); }
}
