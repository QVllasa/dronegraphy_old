import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IUser, User} from "../../../../@dg/models/user.model";
import {concat, from, Observable, of} from "rxjs";
import {switchMap, take, takeWhile} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../../@dg/services/user.service";
import {AuthenticationService} from "../../../../@dg/services/auth.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'dg-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  orders: { amount: number, date: Date, method: string }[] = [
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    },
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    },
    {
      amount: 5,
      date: new Date(),
      method: 'PayPal'
    }
  ];

  @Input() form: FormGroup;
  currentUser: User = null;
  isLoading: boolean;

  inputType = 'password';
  visible = false;

  constructor(private fb: FormBuilder,
              private afAuth: AngularFireAuth,
              private _snackBar: MatSnackBar,
              private userService: UserService,
              public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = false
    this.authService.user$
        .pipe(
            takeWhile(user => !user, true),
            takeWhile(() => !this.currentUser, true)
        )
        .subscribe(user => {
          if (!user) {
            return
          } else if (!this.currentUser) {
            this.currentUser = user;
            this.form.patchValue({
              info: {
                email: this.currentUser.email,
                firstName: this.currentUser.firstName,
                lastName: this.currentUser.lastName,
              },
            })
            return
          }
        })

    //+++++++++++++++++++++++

  }



  changeUserInfo(user: User): Observable<IUser | null> {
    return this.userService.updateUser(user)
  }

  changeUserEmail(user: User): Observable<void> {
    return this.afAuth.authState.pipe(
        switchMap((res) => {
          return from(res.updateEmail(user.email))
        })
    )
  }

  changePassword(newPassword): Observable<void> {
    if ((newPassword != '') && !this.form.get('password').invalid) {
      return this.afAuth.authState.pipe(
          switchMap(res => {
                return from(res.updatePassword(newPassword));
              }
          )
      )
    }
    return of(null)
  }

  send() {
    this.form.disable()
    if (this.form.get('info').invalid) {
      this.form.get('password').enable()
      this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
      return
    }
    this.isLoading = true;
    const newEmail = this.form.get('info.email').value
    const newPassword = this.form.get('password').value
    const lastName = this.form.get('info.lastName').value;
    const firstName = this.form.get('info.firstName').value;

    this.currentUser.email = newEmail;
    this.currentUser.firstName = firstName;
    this.currentUser.lastName = lastName;

    const changeUserInfo$ = this.changeUserInfo(this.currentUser).pipe(take(1));
    const changeEmail$ = this.changeUserEmail(this.currentUser).pipe(take(1));
    const changePw$ = this.changePassword(newPassword).pipe(take(1));

    const combined$ = concat(
        changeEmail$,
        changeUserInfo$,
        changePw$
    )

    combined$.subscribe(() => {
          this.form.get('password').enable()

          this.isLoading = false;
          this.form.patchValue({
            info: {
              email: this.currentUser.email,
              firstName: this.currentUser.firstName,
              lastName: this.currentUser.lastName,
            },
            password: ''
          })
          this._snackBar.open('Benutzerdaten aktualisiert.', 'SCHLIESSEN')
        },
        err => {
          if (err) {
            this.isLoading = false;

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
        });

  }

  togglePassword() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      // this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      // this.cd.markForCheck();
    }
  }

  onActivateForm(type) {
    this.form.get('info.' + type).enable();
  }

  onDeactivateForm(type) {
    this.form.get('info.' + type).disable();
  }

}
