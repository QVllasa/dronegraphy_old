import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {takeWhile} from "rxjs/operators";
import {AuthenticationService} from "../../../../../@dg/services/auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../../../@dg/services/user.service";

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

    // @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
    file: File = null


    constructor(public authService: AuthenticationService,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
    }

    ngOnInit(): void {
        this.isLoading = false
        this.form = this.userService.initForm()
        this.userService.user$
            .pipe(
                takeWhile(user => !user, true),
            )
            .subscribe(user => {
                console.log("userService: ", user)
                if (!user) {
                    return
                }
                this.form.patchValue({
                    info: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                })
            })
    }


    // TODO duplicate Code -> create util function
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
                this.userService.handleForm(this.form)
            },
            error => {
                this.isLoading = false;
                if (error) {
                    this.userService.handleError(error)
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

    onFileSelected(event) {
        this.file = event.target.files[0];
        console.log(this.file);
        // const fileUpload = this.fileUpload.nativeElement;
        // fileUpload.onchange = () => {
        //     for (let index = 0; index < fileUpload.files.length; index++) {
        //         const file = fileUpload.files[index];
        //         this.files.push({data: file, inProgress: false, progress: 0});
        //     }
        // };
        // fileUpload.click();
    }

}
