import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IUser, User} from '../models/user.model';
import {environment} from '../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject, concat, from, Observable, of} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VideoService} from './video.service';


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private http: HttpClient) {
    }

    // updateCart(ids: string[]) {
    //     const cart = {activeCart: ids};
    //     return this.http.patch<string[]>(environment.apiUrl + '/activeCart', cart);
    // }

}
