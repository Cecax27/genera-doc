import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Step1 } from '../step-1/step-1';
import { CommonModule } from '@angular/common';
import { Step2 } from '../step-2/step-2';
import { Step3 } from '../step-3/step-3';
import { Step4 } from '../step-4/step-4';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Step1, Step2, Step3, Step4],
  template: `
    <div class="top-0 right-0 bottom-0 flex flex-col h-screen p-10 justify-center gap-5">
      @if (progress===0) {
        <app-step-1 (nextStep)="handleNextStep()" (addSvgFileEvent)="getSvgFile($event)" (svgParamsEvent)="getParams($event)"></app-step-1>
      } @else if (progress===1) {
        @defer (on viewport) {
          <app-step-2 (nextStep)="handleNextStep()" [params]="svgParams" (addCsvFileEvent)="getCsvFile($event)"></app-step-2>
        } @placeholder {
          <div>Cargando...</div>
        }
      } @else if (progress===2) {
        <app-step-3 (nextStep)="handleNextStep()" [svgFile]="svgFile" [csvFile]="csvFile" (url)="getDownloadUrl($event)"></app-step-3>
      } @else if (progress===3) {
        <app-step-4 (nextStep)="handleNextStep()" ></app-step-4>
      }
    </div>
  `,
  styles: ``
})
export class Main {
  @Output() nextStep = new EventEmitter<void>();
  @Input() progress: number = 0;
  svgFile = '';
  svgParams: string[] = [];
  csvFile = '';
  downloadUrl = '';

  getSvgFile(svgString: string ){
    this.svgFile = svgString;
  }

  getParams(svgParams: string[]){
    this.svgParams = svgParams;
  }

  getCsvFile(csvString: string){
    this.csvFile = csvString;
  }

  handleNextStep() {
    this.nextStep.emit();
  }

  getDownloadUrl(downloadUrl: string) {
    this.downloadUrl = downloadUrl;
  }
}
