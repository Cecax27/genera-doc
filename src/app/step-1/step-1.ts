import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-100 w-full max-w-full p-10 rounded-4xl flex flex-col gap-5 items-center justify-center">
      <input class="w-100 py-2 file:mr-3 file:px-5 text-sm text-gray-700 file:text-black file:border-black file:border file:p-2 file:rounded-full file:cursor-pointer hover:file:bg-gray-200 hover:file:border-gray-500" 
        id="svg_input" 
        type="file"
        accept=".svg">
        
      <input type="submit" 
        (click)="onSubmit()" 
        value="Cargar" 
        class="bg-black py-3 px-10 text-white rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
    </div>
  `,
  styles: ``
})
export class Step1 {
  @Output() nextStep = new EventEmitter<void>();
  @Output() addSvgFileEvent = new EventEmitter<string>();
  @Output() svgParamsEvent = new EventEmitter<string[]>();

  constructor() {}

  onSubmit() {
    const input = document.getElementById('svg_input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result;
        if (!fileContent) return;
        
        const params = [...new Set(
          fileContent.toString()
            .split("{{")
            .slice(1)
            .map((param: string) => param.split("}}")[0].trim())
        )];
        
        if (params.length === 0) {
          alert('Este archivo no tiene ningún parámetro. No es una plantilla');
          return;
        }
        
        console.log('Parámetros encontrados:', params);
        this.addSvgFileEvent.emit(fileContent.toString());
        this.svgParamsEvent.emit(params);
        console.log(file);
        
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
}
