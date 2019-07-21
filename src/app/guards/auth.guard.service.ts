import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { Utils } from "../shared/utils.shared";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor() { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return true;// Depois que configurar a parte de permissões do local storage, reativar esse recurso
    /* let permissoes: Object = Utils.verificarPermissoes();
    let rota: string = route["url"].toString().split(",")[0];
    for (let key in permissoes) {
      if (permissoes[key]["rota"] == rota) {
        return true;
      }
    }
    return false; */
  }
}
