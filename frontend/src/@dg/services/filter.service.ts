import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface IFilterOption{
  id: string,
  value: string,
  parent: string,

}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) { }

  getFilters(){
    return this.http.get<IFilterOption[]>(environment.apiUrl+"/filters")
  }


}
