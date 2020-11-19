import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser} from "../interfaces/user.interface";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUser(uid){
    return this.http.get<IUser>(environment.apiUrl+'/users/'+uid).toPromise();
  }
}
