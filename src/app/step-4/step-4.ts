import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-step-4',
  imports: [],
  template: `
      <div class="bg-gray-100 w-full max-w-full p-10 rounded-4xl flex flex-col gap-5 items-center justify-center">

  @if (downloadUrl==='') {
    <p> Cargando </p>
  } @else {
    <a href="{{downloadUrl}}" class="bg-black py-3 px-10 text-white rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
      Descargar
    </a>

  }
</div>
  `,
  styles: ``
})
export class Step4 {
  @Output() nextStep = new EventEmitter<void>();
  @Input() downloadUrl = '';

  constructor() {}
}
