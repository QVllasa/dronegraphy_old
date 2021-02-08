import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Video} from "../models/video.model";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    favs$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>(null)


    constructor(private userService: UserService,
                private http: HttpClient) {
    }

    ngOnInit() {
    }

    saveAsFavorite(id: string) {
        return this.http.post<string[]>(environment.apiUrl + "/addToFavorites/" + id, id)
    }

    deleteFromFavorites(id: string){
        return this.http.post<string[]>(environment.apiUrl + "/removeFromFavorites/" + id, id)
    }
}
