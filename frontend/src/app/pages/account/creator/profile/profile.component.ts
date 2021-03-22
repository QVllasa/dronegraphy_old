import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {map, switchMap, takeWhile, tap} from 'rxjs/operators';
import {AuthenticationService} from '../../../../../@dg/services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../../../@dg/services/user.service';
import {UploadService} from '../../../../../@dg/services/upload.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {of} from 'rxjs';
import {User} from '../../../../../@dg/models/user.model';
import {VideoService} from '../../../../../@dg/services/video.service';
import {Video} from '../../../../../@dg/models/video.model';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
    selector: 'dg-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;
    videos: Video[];
    videoCtrl = new FormControl();
    user: User;
    selectedVideos;

    inputType = 'password';
    visible = false;
    fileToUpload: File = null;


    @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
    file: File = null;


    constructor(public userService: UserService,
                private uploadService: UploadService,
                private videoService: VideoService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.isLoading = false;
        this.form = this.userService.initForm();
        this.userService.user$
            .pipe(
                takeWhile(user => !user, true),
                switchMap(user => {
                        if (!user) {
                            return;
                        }
                        this.user = user;
                        this.form.patchValue({
                            info: {
                                email: this.user.email,
                                firstName: this.user.firstName,
                                lastName: this.user.lastName,
                                slogan: this.user.slogan,
                            },
                        });
                        return this.videoService.getVideosByOwner(this.user.uid);
                    }
                )
            )
            .subscribe(res => {
                this.videos = this.videoService.mapVideos(res);
                const list = [];
                if (this.user.videoHeader && this.user.videoHeader.length !== 0) {
                    for (const v of this.videos) {
                        for (const j of this.user.videoHeader) {
                            if (v.storageRef === j) {
                                list.push(v.storageRef);
                            }
                        }
                        this.videoCtrl = new FormControl(list);
                    }
                }

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
        this.userService.sendChanges(this.form)
            .subscribe(result => {
                    this.isLoading = false;
                    this.userService.handleForm(this.form);
                },
                error => {
                    console.log(error);
                    this.isLoading = false;
                    if (error) {
                        this.userService.handleError(error);
                    }
                });
        this.user.videoHeader = this.videoCtrl.value;
        this.videoService.setProfileHeader(this.user.videoHeader).subscribe();
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
                    this.userService.user$.value.setProfileImage(res);
                    this._snackBar.open('Profilbild aktualisiert', 'SCHLIESSEN');
                    this.fileUpload.nativeElement.value = '';
                }
            });

    }

}
