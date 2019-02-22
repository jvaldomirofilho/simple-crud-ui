import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

export interface ServiceCrud {

    pesquisar(filtro: any): Observable<any>;

    salvar(entity: any): Observable<any>;

    atualizar(entity: any): Observable<any>;

    pesquisarPorId(id: any): Observable<any>;

}