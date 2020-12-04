import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {exhaustMap, map, take} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthenticationService} from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private afAuth: AngularFireAuth,
                private authService: AuthenticationService) {}

    //Get Token from Firebase if any and add it to every request sent from httpClient
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.afAuth.idToken.pipe(
            take(1),
            exhaustMap(token => {
                if (!token) {
                    return next.handle(request);
                }
                request = request.clone({
                    headers: new HttpHeaders({'Authorization': 'Bearer ' + token})
                });

                console.log("Token wird allen Requests angehängt", token)
                return next.handle(request);
            })
        )
    }
}
