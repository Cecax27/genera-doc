import { Component, Output, EventEmitter, Input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-step-3',
  imports: [],
  template: `
    <div class="bg-gray-100 w-full max-w-full p-10 rounded-4xl flex flex-col gap-5 items-center justify-center">
      <h3 class="font-medium text-left">Plantilla</h3>
      <div class="w-20 h-fit">
        <div [innerHtml]="sanitizedSvg" class="border-gray-300 border rounded-2xl shadow-gray-300 shadow-xs"></div>
      </div>
      <h3 class="font-medium text-left">Datos</h3>
      <div class="overflow-y-auto max-h-40 min-w-full border border-gray-300 rounded-2xl">
        <table class="text-xs min-w-full rounded-xl">
          <thead class="border-b-gray-300">
            <tr class="bg-gray-200">
              @for (param of headers(); track $index) {
                <th class="p-2 capitalize font-semibold text-gray-900 text-left">{{param}}</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            @for (row of tableBody(); track $index) {
              <tr class="">
                @for (cell of row; track $index) {
                  <td class="p-2 whitespace-nowrap text-gray-800">{{cell}}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="text-xs italic text-gray-600">Se harán {{tableBody().length}} documentos.</p>
      <input type="submit" (click)="nextStep.emit()" value="Continuar" class="bg-black py-3 px-10 text-white rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
    </div>
  `,
  styles: ``
})
export class Step3 {
  @Output() nextStep = new EventEmitter<void>();
  @Input() svgFile: string = '';
  @Input() csvFile: string = '';

  headers = signal<string[]>([]);
  tableBody = signal<string[][]>([]);

  sanitizedSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.svgFile) {
      const regex = /\s(width|height)="[^"]*"/g;
      this.sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(this.svgFile.replace(regex, ''));
    }
    this.headers.set(this.csvFile.split('\n')[0].split(',').map(header => header.trim()));
    this.tableBody.set(this.csvFile.split('\n').slice(1).map(row => row.split(',').map(cell => cell.trim())).filter(row => row.length === this.headers().length));
  }

}
