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
export class UserService {

    user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient,
                private videoService: VideoService,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
    }

    initForm() {
        return new FormGroup({
            info: new FormGroup({
                firstName: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z ]*')]),
                lastName: new FormControl({
                    value: '',
                    disabled: true
                }),
                email: new FormControl({
                    value: '',
                    disabled: true
                }, [Validators.required, Validators.email]),
                slogan: new FormControl({
                    value: '',
                    disabled: true,
                })
            }),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        });
    }

    registerMember(user, password: string) {
        const options = {headers: new HttpHeaders().append('Pw', password)};
        return this.http.post<IUser>(environment.apiUrl + '/register', user, options);
    }

    getUser(id: string | number): Observable<IUser> {
        return this.http.get<IUser>(environment.apiUrl + '/users/' + id);
    }

    updateUser(user: User) {
        return this.http.patch<IUser>(environment.apiUrl + '/users/' + user.uid, user);
    }

    deleteUser() {
        this.afAuth.authState.pipe(
            take(1),
            tap(user => {
                if (!user) {
                    return;
                }
                user.delete().then();
            })).subscribe();


    }

    changeUserInfo(user: User): Observable<IUser | null> {
        console.log('user to change', user);
        return this.updateUser(user);
    }

    // Firebase
    changeUserEmail(user: User): Observable<void> {
        return this.afAuth.authState.pipe(
            switchMap((res) => {
                return from(res.updateEmail(user.email));
            })
        );
    }

    // Firebase
    changePassword(newPassword, form): Observable<void> {
        if ((newPassword !== '') && !form.get('password').invalid) {
            return this.afAuth.authState.pipe(
                switchMap(res => {
                        return from(res.updatePassword(newPassword));
                    }
                )
            );
        }
        return of(null);
    }

    sendChanges(form: FormGroup) {
        form.disable();
        if (form.get('info').invalid) {
            form.get('password').enable();
            this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
            return;
        }

        const newPassword = form.get('password').value;

        this.user$.value.email = form.get('info.email').value;
        this.user$.value.firstName = form.get('info.firstName').value;
        this.user$.value.lastName = form.get('info.lastName').value;
        this.user$.value.slogan = form.get('info.slogan').value;

        const changeUserInfo$ = this.changeUserInfo(this.user$.value).pipe(take(1));
        const changeEmail$ = this.changeUserEmail(this.user$.value).pipe(take(1));
        const changePw$ = this.changePassword(newPassword, form).pipe(take(1));

        return concat(
            changeEmail$,
            changeUserInfo$,
            changePw$
        );
    }

    handleForm(form) {
        form.get('password').enable();
        form.patchValue({
            info: {
                email: this.user$.value.email,
                firstName: this.user$.value.firstName,
                lastName: this.user$.value.lastName,
            },
            password: ''
        });
        this._snackBar.open('Benutzerdaten aktualisiert.', 'SCHLIESSEN');
    }

    handleError(err) {
        if (err) {
            switch (err.code) {
                case 'auth/requires-recent-login': {
                    this._snackBar.open('Bitte melde dich erst kurz neu an.', 'SCHLIESSEN');
                    break;
                }
                case 'auth/email-already-in-use': {
                    this._snackBar.open('Diese E-Mail wird schon verwendet.', 'SCHLIESSEN');
                    break;
                }
                case 'auth/invalid-email': {
                    this._snackBar.open('E-Mail Adresse unzulässig.', 'SCHLIESSEN');
                    break;
                }
                default: {
                    this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
                }
            }
        }
    }

    registerCreator(user, password: string) {
    }


    getCreator(id: string | number): Observable<IUser> {
        return this.http.get<IUser>(environment.apiUrl + '/creators/' + id);
    }

    getCreators() {
        return this.http.get<IUser[]>(environment.apiUrl + '/creators')
            .pipe(
                map(res => {
                    return this.mapCreators(res);
                })
            );
    }

    mapCreators(res: IUser[]): User[] {
        const creators: User[] = [];
        for (const creator of res) {
            creators.push(new User().deserialize(creator));
        }
        return creators;
    }


}
