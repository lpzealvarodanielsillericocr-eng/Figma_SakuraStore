import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, inject, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconoComponent, NombreIcono } from '../icono/icono.component';

@Component({
  selector: 'app-campo',
  standalone: true,
  imports: [IconoComponent],
  templateUrl: './campo.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CampoComponent), multi: true }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampoComponent implements ControlValueAccessor {
  @Input() identificador = '';
  @Input() etiqueta = '';
  @Input() placeholder = '';
  @Input() tipo: 'text' | 'number' | 'search' = 'text';
  @Input() opciones: readonly string[] = [];
  @Input() error = '';
  @Input() ayuda = '';
  @Input() requerido = false;
  @Input() compacto = false;
  @Input() minimo: number | null = null;
  @Input() paso: string | null = null;
  @Input() icono?: NombreIcono;
  @ViewChild('entrada') entrada?: ElementRef<HTMLInputElement | HTMLSelectElement>;
  valor = '';
  deshabilitado = false;
  private readonly detector = inject(ChangeDetectorRef);
  private cambiar: (valor: string) => void = () => {};
  tocar: () => void = () => {};

  writeValue(valor: unknown): void {
    this.valor = valor == null ? '' : String(valor);
    this.detector.markForCheck();
  }
  registerOnChange(funcion: (valor: string) => void): void { this.cambiar = funcion; }
  registerOnTouched(funcion: () => void): void { this.tocar = funcion; }
  setDisabledState(valor: boolean): void {
    this.deshabilitado = valor;
    this.detector.markForCheck();
  }
  actualizar(evento: Event): void {
    this.valor = (evento.target as HTMLInputElement | HTMLSelectElement).value;
    this.cambiar(this.valor);
  }
  enfocar(): void { this.entrada?.nativeElement.focus(); }
}
