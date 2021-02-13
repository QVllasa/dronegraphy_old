import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IChildCategory, IParentCategory} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getChildCategories(){
    return this.http.get<IChildCategory[]>(environment.apiUrl+'/child_categories')
  }

  getParentCategories(){
    return this.http.get<IParentCategory[]>(environment.apiUrl+'/parent_categories')
  }
}
