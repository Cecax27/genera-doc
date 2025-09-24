import { Routes } from '@angular/router';
import { Home } from './home/home';
import { GenerateSVG } from './generate-svg/generate-svg';

export const routes: Routes = [{
    path: '',
    title: 'Genera Docs',
    component: Home,
},{
    path: 'genera-svg',
    title: 'Genera SVG',
    component: GenerateSVG,
}
];
