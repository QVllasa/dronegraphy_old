import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {switchMap, take, takeWhile} from "rxjs/operators";
import {AuthenticationService} from "../../../../../@dg/services/auth.service";
import {IUser, User} from "../../../../../@dg/models/user.model";
import {concat, from, Observable, of} from "rxjs";
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
    currentUser: User = null;
    isLoading: boolean;

    inputType = 'password';
    visible = false;
    fileToUpload: File = null;

    @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
    files = [];


    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(public authService: AuthenticationService,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private afAuth: AngularFireAuth) {
    }

    ngOnInit(): void {
        this.isLoading = false
        this.form = this.userService.initForm()
        // this.currentUser = this.userService;
    }


    // TODO duplicate Code -> create util function
    onActivateForm(type) {
        this.form.get('info.' + type).enable();
    }

    onDeactivateForm(type) {
        this.form.get('info.' + type).disable();
    }


    send() {
        this.userService.sendChanges();
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

    onClick() {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
            for (let index = 0; index < fileUpload.files.length; index++) {
                const file = fileUpload.files[index];
                this.files.push({data: file, inProgress: false, progress: 0});
            }
        };
        fileUpload.click();
    }

}
