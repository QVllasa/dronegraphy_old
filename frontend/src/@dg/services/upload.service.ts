import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadImage(id: string, file: FormData){
    return this.http.post<File>(environment.apiUrl + '/users/'+id, file, {
      reportProgress: true,
      observe: 'events'
    })
  }

}
