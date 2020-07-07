import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioProfessor } from './usuario-professor.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root',
})
export class UsuarioProfessorService {
  constructor(private http: HttpClient) { }


  public inserir(usuarioProfessor: UsuarioProfessor): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')) };
    return this.http.post(CONSTANTES.N_HOST_API + 'usuario-professor', usuarioProfessor, headers);
  }

  public desvincular(usr_id: number): Observable<any> {
    const headers = { headers: new HttpHeaders().append('Content-type', 'application/json').append('Authorization', localStorage.getItem('token')) };
    return this.http.post(CONSTANTES.N_HOST_API + 'usuario-professor/desvincular', { usr_id }, headers);
  }



}
