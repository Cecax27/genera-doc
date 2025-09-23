import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-step-2',
  imports: [],
  template: `
  <div class="gap-5 flex flex-col">

    <div class="bg-gray-100 w-full max-w-full p-10 rounded-4xl flex flex-col gap-5 items-center justify-center">
      <h3 class="font-medium text-left">Parámetros encontrados</h3>
      <p class="flex gap-2">
        @for (param of params; track $index) {
          <span class="bg-orange-200 py-1 px-3 rounded-full text-orange-900 text-sm">{{param}}</span>
        }
      </p>
      <a href="#" class="text-sm underline" (click)="downloadCsvTemplate()">Descargar plantilla .csv</a>
    </div>
    <div class="bg-gray-100 w-full max-w-full p-10 rounded-4xl flex flex-col gap-5 items-center justify-center">
      
      <input class="w-100 py-2 file:mr-3 file:px-5 text-sm text-gray-700 file:text-black file:border-black file:border file:p-2 file:rounded-full file:cursor-pointer hover:file:bg-gray-200 hover:file:border-gray-500" 
      id="csv_input" 
      type="file"
      accept=".csv">
      
      <input type="submit" 
      (click)="onSubmit()" 
      value="Cargar" 
      class="bg-black py-3 px-10 text-white rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
    </div>
  </div>
    
  `,
  styles: ``
})
export class Step2 {
  @Input() params: string[] = [];
  @Output() nextStep = new EventEmitter<void>();
  @Output() addCsvFileEvent = new EventEmitter<string>();

  onSubmit() {
    const input = document.getElementById('csv_input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result;
        if (!fileContent) return;

        const headers = fileContent.toString().split("\n")[0].split(",").map(header => header.trim());

        const sortedParams = [...this.params].sort();
        const sortedHeader = [...headers].sort();

        for (let i = 0; i < sortedParams.length; i++) {
          if (sortedParams[i] !== sortedHeader[i]) {
            alert(`Falta el parámetro ${sortedParams[i]}. Agrégalo a tu archivo de datos.`)
            return;
          }
        }
        
        const rows = fileContent.toString()
            .split("\n")
            .slice(1)
            .map((row: string) => row.split(",").map(cell => cell.trim())).filter(row => row.length === this.params.length);
        
        console.log(rows);
        

        if (rows.length === 0) {
          alert('Este archivo no tiene ninguna fila. Agrega datos para continuar.');
          return;
        }
        
        console.log('Filas encontradas:', rows);
        this.addCsvFileEvent.emit(fileContent.toString());
        
        this.nextStep.emit();
      };

      reader.onerror = (e: ProgressEvent<FileReader>) => {
        console.error('Error reading file:', e.target?.error);
      };

      reader.readAsText(file);
    } else {
      alert('Selecciona un archivo');
    }
  }

  downloadCsvTemplate() {
    const csvContent = "data:text/csv;charset=utf-8," + (this.params.map(param => param).join(", "));
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  constructor() {};
}
