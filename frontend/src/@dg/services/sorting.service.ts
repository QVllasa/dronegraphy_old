import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface ISortOption{
  id: string,
  value: string,
  parent: string,

}

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor(private http: HttpClient) { }

  getFilters(){
    return this.http.get<ISortOption[]>(environment.apiUrl+"/filters")
  }


}
