# Sakura Store: frontend Angular paso a paso

Práctica GUI basada en la última captura: cabecera con el logo recibido, menú en un carril horizontal, Inicio y Volver a la derecha, tabla y formulario. Colores rosa suaves, bordes redondeados y controles funcionales.

## Qué utilizamos

Angular 20.3, TypeScript, HTML, CSS y formularios reactivos. Lombok es para Java, por eso no corresponde a este proyecto. Tampoco utilizamos Spring Boot, Spring Web, Spring Data, H2, PostgreSQL ni Maven.

El código que escribimos está en archivos .ts; Angular lo compila a JavaScript. Las plantillas están en .html y el estilo común en src/styles.css. No hay plantillas ni estilos escritos dentro del TypeScript.

Los productos viven en memoria en InventarioService. Al recargar la página vuelven los cinco productos de ejemplo. “Administrador” es un perfil de demostración; esta práctica no implementa autenticación ni permisos de un servidor.

## 1. Abrir o crear el proyecto en IntelliJ IDEA

Puedes abrir la carpeta sakura-gui del proyecto preparado con File > Open. Abre la carpeta que contiene package.json y angular.json.

En la terminal de IntelliJ, situada en esa carpeta, comprueba Node y npm:

```powershell
node --version
npm --version
```

Angular 20.3 es compatible con Node 20.19 o superior de la serie 20, Node 22.12 o superior de la serie 22, y Node 24. Usa una de esas series, no cualquier número mayor.

Si prefieres construirlo desde cero, ejecuta esto en la terminal de IntelliJ. La primera línea sale de tu proyecto anterior para que ng new no intente crear una aplicación dentro de otro workspace Angular:

```powershell
Set-Location $env:USERPROFILE
npx @angular/cli@20 new sakura-gui --standalone --style=css --routing=false --ssr=false --skip-tests --file-name-style-guide=2016 --defaults
Set-Location .\sakura-gui
```

Si la CLI muestra una pregunta para instalar su paquete, acepta con y. Después abre esta carpeta sakura-gui en IntelliJ con File > Open.

## 4. Instalar y ejecutar

Cuando hayas copiado los archivos, ejecuta estos comandos en la carpeta que contiene package.json:

```powershell
npm install
npm start
```

Abre http://localhost:4200. Mantén la terminal abierta mientras trabajas. Ctrl+C detiene el servidor.

Si PowerShell indica que no puede cargar npm.ps1 por la política de scripts, utiliza npm.cmd install y npm.cmd start; no necesitas cambiar la política del sistema.

Si el puerto 4200 está ocupado por el otro Sakura Store, utiliza:

```powershell
npm start -- --port 4201
```

Entonces abre http://localhost:4201.

Para comprobar la compilación:

```powershell
npm run build
```

### Ejecutar con el botón Run de IntelliJ

Si tu instalación tiene disponible la integración npm:

1. Run > Edit Configurations > + > npm.
2. Nombre: Sakura GUI.
3. Package.json: selecciona el package.json de sakura-gui.
4. Command: run.
5. Scripts: start.
6. Node interpreter/runtime: selecciona tu instalación de Node.js.
7. Apply > OK > Run.

Si npm no aparece como tipo de configuración en tu instalación, ejecuta npm start en la terminal integrada. La aplicación sigue ejecutándose desde IntelliJ; no necesitas un proyecto Java para ello.

## 5. Qué hace cada archivo

### Modelo: producto.model.ts

La interface Producto define la forma de cada producto: identificador, código, nombre, categoría, precio, stock y mínimo. Una interface comprueba tipos durante el desarrollo; no crea una tabla ni guarda datos.

NuevoProducto usa Omit para excluir id y stock de los datos del formulario. El servicio genera el id y empieza el stock en cero. OpcionMenu limita las opciones a cuatro cadenas válidas y evita errores de escritura en el menú.

### Servicio: inventario.service.ts

@Injectable({ providedIn: 'root' }) hace disponible una misma instancia del servicio en toda la aplicación.

signal<Producto[]> contiene los cinco productos de ejemplo. asReadonly permite que los componentes lean esa señal sin llamar directamente a set o update sobre ella.

guardar recibe un producto nuevo, normaliza el código con trim y toUpperCase, y usa some para detectar duplicados. Devuelve false si el código existe. Si es nuevo, genera el id, asigna stock 0 y usa update para añadirlo al principio de una nueva lista. Devuelve true cuando lo registra.

No se realiza ninguna llamada HTTP ni consulta SQL. La información se conserva mientras esta instancia de la aplicación siga abierta.

### IconoComponent

Dibuja iconos SVG mediante un mapa de trazos. @Input nombre permite escoger el icono desde otro componente. [attr.d] enlaza el trazo elegido a la etiqueta path.

aria-hidden=true evita que un lector de pantalla anuncie el dibujo decorativo; el botón que lo contiene tiene su propia etiqueta accesible. Los iconos están incluidos en el proyecto y no necesitan Font Awesome ni una CDN.

### BotonComponent

Encapsula un button nativo. Sus @Input configuran texto, icono, estilo, tipo, etiqueta accesible, selección y estado deshabilitado.

@Output accion emite un evento cuando se pulsa. El componente padre decide qué acción ejecutar. El botón de Guardar tiene tipo submit: activa el ngSubmit del formulario. Limpiar es tipo button, por eso no envía el formulario.

[disabled] utiliza el bloqueo nativo del botón. aria-label identifica los botones que solo muestran un icono; title proporciona una descripción al pasar el cursor. aria-pressed indica la opción seleccionada en el menú.

### CampoComponent

Es el componente reutilizable de entrada. Puede mostrar input de texto, búsqueda o número; si recibe opciones muestra select. Sus etiquetas, ayuda y error se configuran mediante @Input.

Implementa ControlValueAccessor para conectar este componente propio con los formularios de Angular. NG_VALUE_ACCESSOR registra esa conexión. multi=true agrega un proveedor de este tipo. forwardRef permite referirse a CampoComponent en el decorador antes de que la clase esté declarada.

- writeValue: recibe el valor del modelo y lo muestra en el campo. Se ejecuta, por ejemplo, al limpiar el formulario.
- registerOnChange: recibe la función de Angular que informa los cambios al FormControl.
- actualizar: lee el valor del input o select y llama a esa función.
- registerOnTouched: recibe la función que marca el campo como tocado.
- tocar: se ejecuta al salir del campo, mediante blur.
- setDisabledState: refleja si Angular deshabilita el control.
- enfocar: mueve el foco al campo, usando ViewChild y ElementRef.

ChangeDetectorRef.markForCheck avisa que la vista debe actualizarse cuando Angular escribe un valor o cambia el estado deshabilitado.

[for] conecta el label con el id del input. aria-invalid indica un error y aria-describedby conecta el control con su mensaje. En el buscador la etiqueta está oculta visualmente mediante sr-only, pero sigue siendo accesible.

### BarraTituloComponent

Muestra el logo original recibido mediante img, el título, subtítulo y perfil de demostración. El logo está en public/sakura-logo.png. CSS lo encuadra para ocultar los bordes de la captura. Es un componente de presentación: no inicia una sesión real. Mantenerlo separado permite reutilizar la cabecera en otros diseños.

### MenuComponent

Recorre opciones con @for. track opcion.valor identifica cada botón. @Input seleccion indica cuál está activo y @Output seleccionar comunica al padre la opción que se pulsó.

El menú no cambia la lista por sí mismo. AppComponent recibe el evento y modifica el estado de la pantalla. Esta separación evita que el menú dependa directamente del servicio de productos.

### NavegacionComponent

Contiene dos instancias de BotonComponent. Inicio muestra la lista completa y limpia la búsqueda. Volver recupera la opción de menú anterior. puedeVolver deshabilita el botón cuando no hay historial.

Es navegación dentro de una sola pantalla. No usa rutas adicionales ni el historial del navegador.

### TablaProductosComponent

Recibe productos mediante @Input y dibuja una fila por producto. track producto.id permite que Angular identifique las filas al cambiar la lista.

Usa DecimalPipe para mostrar precios con dos decimales. La insignia roja se aplica cuando stock es menor que stockMinimo; si tiene exactamente 30 con mínimo 30, se muestra disponible, como en las capturas.

El buscador es un FormControl conectado a CampoComponent. valueChanges emite lo que se escribe y el componente lo comunica al padre con buscar.emit. takeUntilDestroyed termina la suscripción cuando el componente se destruye.

@empty presenta el estado sin resultados. La tabla tiene encabezados con scope=col y puede desplazarse horizontalmente en pantallas pequeñas.

### FormularioProductoComponent

inject obtiene InventarioService y FormBuilder mediante la inyección de dependencias de Angular.

fb.nonNullable.group crea el formulario con cinco controles tipados como cadenas. Código y nombre son obligatorios; el código permite letras, números, guion y guion bajo; el nombre no puede contener solo espacios. Categoría es obligatoria. Precio debe ser mayor que cero y tener como máximo dos decimales. Stock mínimo debe ser un entero igual o mayor que 30.

Los campos personalizados envían cadenas incluso si el input es de tipo number. Antes de registrar, Number convierte precio y stockMinimo a valores numéricos.

error devuelve un mensaje según los validadores que fallen. Antes de tocar o modificar un control, no muestra errores. guardar marca los controles como tocados para que se vean los campos pendientes y sale si formulario.invalid es true.

getRawValue obtiene todos los valores del formulario. El servicio devuelve false cuando el código está repetido; entonces setErrors añade el error duplicado al código y se enfoca ese campo.

Cuando el servicio guarda correctamente, limpiar restablece campos y mínimo 30. Después se asigna el mensaje de éxito y guardado.emit avisa al componente padre. La lista vuelve a la vista completa para que se vea el producto nuevo.

ngSubmit relaciona el envío del formulario con guardar. novalidate deja los mensajes de validación a cargo de Angular. role=status anuncia la confirmación de guardado. La suscripción a valueChanges borra el mensaje de éxito cuando se empieza a editar otra vez.

### AppComponent

Organiza la pantalla e importa los ocho componentes. seleccion y busqueda son señales de estado. historial guarda las opciones visitadas dentro de esta vista.

productosVisibles es una señal calculada con computed. Combina texto de búsqueda y filtro de stock bajo. Lee los productos del servicio y devuelve los que cumplen ambas condiciones.

seleccionar cambia la opción activa y guarda la anterior en el historial. Al elegir Añadir producto, llama a enfocarCodigo del formulario. inicio selecciona todos y limpia la búsqueda. volver toma la última opción de historial, la elimina del historial y la selecciona. productoGuardado vuelve a la lista completa.

En el HTML, [productos] pasa datos a la tabla, mientras (buscar) recibe eventos. Los corchetes pasan valores; los paréntesis escuchan eventos. {{ valor }} muestra texto y señal() lee el valor actual de una señal.

@if controla la ayuda y @for, las listas. standalone=true indica que no hace falta declarar este componente en un NgModule. imports enumera los componentes y directivas que su plantilla utiliza. templateUrl conecta cada clase con su archivo HTML separado.

ChangeDetectionStrategy.OnPush reduce comprobaciones innecesarias. Las señales y los eventos de la interfaz notifican los cambios que deben reflejarse.

### main.ts y app.config.ts

main.ts es la entrada de la aplicación. bootstrapApplication inicia AppComponent. appConfig configura la aplicación; provideZonelessChangeDetection usa la detección de cambios sin Zone.js, disponible en la versión de Angular usada aquí.

### styles.css

Define los colores, espacios, bordes, botones, tabla, formulario y estados de foco. Flexbox alinea el menú y los iconos Inicio y Volver en un carril horizontal debajo de la cabecera. CSS Grid coloca la tabla a la izquierda y el formulario a la derecha.

Las media queries adaptan la misma pantalla. En escritorio grande, lista y formulario quedan lado a lado; en pantallas menores se apilan. En móvil el menú sigue en un solo carril con desplazamiento horizontal interno; la tabla también conserva su propio desplazamiento.

cursor:pointer muestra la mano sobre botones y selectores; cursor:text muestra el cursor de escritura dentro de los input. La flecha fuera de estos controles la proporciona el navegador. No dibujamos un cursor falso ni añadimos animaciones.

focus-visible y los estilos de focus muestran qué control recibe el teclado. Los estados de stock tienen una leyenda y etiquetas accesibles además del color.

### Archivos de configuración

package.json contiene dependencias y comandos start/build. angular.json indica entrada, estilos, recursos y configuraciones de desarrollo/producción. tsconfig activa comprobación estricta de TypeScript y plantillas. index.html contiene app-root, idioma español, título y enlace al favicon SVG incluido.

## 6. Recorrido para demostrarlo al ingeniero

1. Mostrar barra de título, menú, iconos y la tabla inicial de cinco productos.
2. Pulsar Stock bajo: aparecen dos productos, con 24 y 18 unidades.
3. Buscar SK-027 en Todos los productos: aparece Taza floral.
4. Guardar con el formulario vacío: aparecen mensajes de campos obligatorios.
5. Probar precio negativo y mínimo 29: se muestran sus errores.
6. Registrar código SK-047, nombre Agenda primaveral, categoría Papelería, precio 35.50 y mínimo 30.
7. Mostrar el nuevo producto arriba de la lista, con stock inicial 0.
8. Intentar repetir SK-047: el formulario lo rechaza sin añadir otra fila.
9. Pulsar Limpiar: vacía los campos y devuelve el mínimo a 30.
10. Pulsar Añadir producto: el cursor de escritura se coloca en Código.
11. Pulsar Ayuda, Inicio y Volver para demostrar sus acciones.
12. Explicar que recargar elimina los registros nuevos porque esta práctica usa memoria temporal.

Frase para exponer: “Implementé una interfaz Angular dividida en componentes standalone. Cada componente tiene TypeScript y una plantilla HTML independiente. Los controles reutilizables se comunican con eventos y el formulario se valida con ReactiveFormsModule. El servicio de inventario conserva datos en memoria y las señales actualizan la tabla cuando guardo o filtro.”

## 7. Verificación realizada

La compilación de producción ng build pasó. También se ejecutó el bundle compilado en jsdom y se comprobaron búsqueda, filtros, validación, guardado, duplicados, limpieza, ayuda, eventos, foco y navegación, sin errores de JavaScript.

No se completó una inspección visual en navegador real en el entorno de generación. jsdom no calcula el diseño de pantalla ni permite confirmar el aspecto móvil. Revisa la página en tu navegador al ejecutarla desde IntelliJ; el CSS incluye las reglas de adaptación.

## Fuentes oficiales

- Componentes Angular: https://v20.angular.dev/guide/components
- Formularios reactivos: https://v20.angular.dev/guide/forms/reactive-forms
- Compatibilidad de versiones: https://v20.angular.dev/reference/versions
- Angular CLI, creación: https://v20.angular.dev/cli/new
- Configuración npm en IntelliJ IDEA: https://www.jetbrains.com/help/idea/run-debug-configuration-npm.html
