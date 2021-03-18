import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {map, takeWhile} from 'rxjs/operators';
import {AuthenticationService} from '../../../../../@dg/services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../../../@dg/services/user.service';
import {UploadService} from '../../../../../@dg/services/upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {of} from 'rxjs';
import {Creator} from '../../../../../@dg/models/user.model';

@Component({
    selector: 'dg-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;

    inputType = 'password';
    visible = false;
    fileToUpload: File = null;

    @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
    file: File = null;


    constructor(public authService: AuthenticationService,
                public userService: UserService,
                private uploadService: UploadService,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
    }

    ngOnInit(): void {
        this.isLoading = false;
        this.form = this.userService.initForm();
        this.userService.user$
            .pipe(
                takeWhile(user => !user, true),
            )
            .subscribe(user => {

                if (!user) {
                    return;
                }
                this.form.patchValue({
                    info: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                });
            });
    }


    onActivateForm(type) {
        this.form.get('info.' + type).enable();
    }

    onDeactivateForm(type) {
        this.form.get('info.' + type).disable();
    }


    send() {
        this.isLoading = true;
        this.userService.sendChanges(this.form).subscribe(result => {
                this.isLoading = false;
                this.userService.handleForm(this.form);
            },
            error => {
                this.isLoading = false;
                if (error) {
                    this.userService.handleError(error);
                }
            });
    }

    togglePassword() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
        } else {
            this.inputType = 'text';
            this.visible = true;
        }
    }

    onFileUpload(event) {
        this.file = event.target.files[0];
        const fd = new FormData();
        fd.append('file', this.file, this.file.name);

        this.uploadService.uploadImage(fd)
            .pipe(
                map((event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                    } else if (event.type === HttpEventType.Response) {
                        return event.body;
                    }
                }),
            )
            .subscribe(res => {
                if (res) {
                    if (this.userService.user$.value instanceof Creator) {
                        this.userService.user$.value.setProfileImage(res);
                        this._snackBar.open('Profilbild aktualisiert', 'SCHLIESSEN');
                        this.fileUpload.nativeElement.value = '';
                    }
                }
            });

    }

}
