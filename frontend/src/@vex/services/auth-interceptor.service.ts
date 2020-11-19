import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {exhaustMap, map, take} from "rxjs/operators";
import {AuthenticationService} from "./auth.service";
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    private token: string

  constructor(private authService: AuthenticationService,
              private afAuth: AngularFireAuth) {
        //TODO
        // this.afAuth.idToken.pipe(
        //     take(1),
        //     map(currentToken => {
        //         if (currentToken){
        //             this.token = currentToken;
        //         }
        //     })
        // )
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.user$.pipe(
        take(1),
        exhaustMap(user => {
            if (!user){
                return next.handle(request);
            }
          const modifiedReq = request.clone({

            //  TODO add Token
            headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token })
          });
          return next.handle(request);
        })
    )}
}
