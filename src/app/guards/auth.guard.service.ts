import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { Utils } from "../shared/utils.shared";
import { AcessoComumService } from '../shared/acesso-comum/acesso-comum.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor() { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const rotaSnapshotString: string = (<string>route['_routerState']['url']).split('?')[0];
    let permissoes: Object = Utils.verificarPermissoes();
    const rota: string = rotaSnapshotString.split('/')[rotaSnapshotString.split('/').length - 1];
    for (let key in permissoes) {
      if (permissoes[key]["rota"] == rota) {
        return true;
      }
    }
    return false;
  }
}