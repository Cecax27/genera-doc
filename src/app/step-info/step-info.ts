import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-step-info',
  imports: [],
  template: `
    <div class="text-white flex flex-col gap-4 mt-20">
      <h1 class="text-3xl font-bold">{{title[progress]}}</h1>
      <h2 class="text-2xl font-medium mb-10">{{subtitle[progress]}}</h2>
      @for (item of paragraphs[progress]; track $index) {
        <p class="flex flex-col">
          <strong>{{item.title}}</strong>
          <span [innerHTML]="(item.content)" class="text-sm"></span>
        </p>
      }
    </div>
  `,
  styles: ``
})
export class StepInfo {
  @Input() progress: number = 0;
  title = ["Paso 1", "Paso 2", "Paso 3", "Paso 4"]
  subtitle = ["Sube tu plantilla", "Sube tu archivo de datos", "Revisar parámetros", "¡Documentos listos!"]
  paragraphs = [[
    {
      title: "¿Qué necesitas aquí?",
      content: "Sube tu plantilla en formato .svg. Esta plantilla debe tener marcadores de posición con un formato específico, como por ejemplo {{nombre_cliente}} o {{fecha}}, para que la herramienta pueda identificar dónde insertar la información."
    },
    {
      title: "¿Cómo funciona?",
      content: "Haz clic en el botón de abajo para seleccionar el archivo de tu plantilla."
    },
    {
      title: "¿Necesitas más ayuda?",
      content: 'Visita nuestra <a href="" class="underline">documentación</a> para saber cómo preparar tu plantilla correctamente.'
    }
  ], [
    {
      title: "¿Qué necesitas aquí?",
      content: "Sube tu archivo .csv que contiene la información que quieres usar. Cada fila de este archivo representa un nuevo documento a generar, y las columnas deben tener nombres que coincidan con los marcadores de posición de tu plantilla (por ejemplo, una columna llamada nombre_cliente y otra fecha)."
    },
    {
      title: "¿Cómo funciona?",
      content: "Haz clic en el botón de abajo para seleccionar el archivo .csv con tus datos."
    },
    {
      title: "¿Necesitas más ayuda?",
      content: 'Visita nuestra <a href="" class="underline">documentación</a> para ver un ejemplo de cómo debe ser el formato del archivo de datos.'
    }
  ], [
    {
      title: "¡Casi listo!",
      content: "Ahora revisa que las columnas de tu archivo CSV coincidan con los marcadores de posición de la plantilla. A la izquierda verás los campos detectados en tu plantilla y a la derecha los encabezados de tu archivo CSV. Confirma que todo esté correcto para continuar."
    },
    {
      title: "¿Cómo funciona?",
      content: "Si los nombres no coinciden, puedes seleccionar la columna correcta de la lista desplegable."
    },
    {
      title: "¿Necesitas más ayuda?",
      content: 'Visita nuestra <a href="" class="underline">documentación</a> para resolver cualquier duda sobre la coincidencia de campos.'
    }
  ], [
    {
      title: "¡Generación completada!",
      content: "Tus documentos se han creado correctamente. Haz clic en el botón de abajo para descargar un archivo .zip que contiene todos los archivos generados individualmente."
    },
    {
      title: "¿Cómo funciona?",
      content: "Haz clic para descargar tu archivo .zip."
    },
    {
      title: "¿Necesitas más ayuda?",
      content: 'Visita nuestra <a href="" class="underline">documentación</a> si tienes algún problema con la descarga o el proceso.'
    }
  ]]
}
