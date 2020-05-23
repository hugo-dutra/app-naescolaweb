import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RedeEnsino } from './rede-ensino.model';
import { Observable } from 'rxjs';
import { CONSTANTES } from '../../shared/constantes.shared';

@Injectable({
  providedIn: 'root'
})
export class RedeEnsinoService {

  constructor(private http: HttpClient) { }

  public inserir(redeEnsino: RedeEnsino): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.post(CONSTANTES.N_HOST_API + "rede-ensino", redeEnsino, headers);
  }

  public listar(): Observable<any> {
    const headers = { headers: new HttpHeaders().append("Content-type", "application/json").append("Authorization", localStorage.getItem("token")) }
    return this.http.get(CONSTANTES.N_HOST_API + "rede-ensino", headers);
  }


  public enviarArquivo(arquivos: FileList): Observable<any> {
    let formData = new FormData();
    const options = {
      headers: new HttpHeaders().set(
        "Authorization",
        localStorage.getItem("token")
      )
    };
    formData.append("image", arquivos[0], arquivos[0].name);
    return this.http.post(
      CONSTANTES.HOST_API + "enviar-logo-rede-ensino",
      formData,
      options
    );
  }

}
