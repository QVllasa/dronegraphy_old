import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Video} from '../models/video.model';
import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    constructor(private userService: UserService,
                private http: HttpClient) {
    }

    updateFavorite(videoIds: string[]) {
        const favorites = {favoriteVideos: videoIds};
        return this.http.patch<string[]>(environment.apiUrl + '/favorites', favorites);
    }


}
