import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://genera-doc.vercel.app/api/generate'; // 👈 cambia por tu URL de Vercel

  constructor(private http: HttpClient) {}

  generateZip(svg: string, csv: string): Observable<Blob> {
    return this.http.post(this.apiUrl, { svg, csv }, { responseType: 'blob' });
  }
}
