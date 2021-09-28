import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    sidenavOpen$ = new BehaviorSubject<boolean>(false);

    private _searchOpen = new BehaviorSubject<boolean>(false);
    searchOpen$ = this._searchOpen.asObservable();

    isDesktop$ = this.breakpointObserver.observe(`(min-width: 1280px)`).pipe(
        map(state => state.matches)
    );

    constructor(private router: Router,
                private breakpointObserver: BreakpointObserver) {
    }

    openSidenav() {
        this.sidenavOpen$.next(true);
    }

    closeSidenav() {
        this.sidenavOpen$.next(false);
    }


    closeSearch() {
        this._searchOpen.next(false);
    }

}
