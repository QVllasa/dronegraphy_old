import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeWhile} from "rxjs/operators";
import {AuthenticationService} from "../../../../../@dg/services/auth.service";
import {User} from "../../../../../@dg/models/user.model";

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

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];


  constructor(public authService: AuthenticationService ) { }

  ngOnInit(): void {
    this.isLoading = false
    this.initForm()
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
  }

  initForm() {
    this.form = new FormGroup({
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
    })
  }

  onActivateForm(type) {
    this.form.get('info.' + type).enable();
  }

  onDeactivateForm(type) {
    this.form.get('info.' + type).disable();
  }

  send(){

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

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++)
      {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0});
      }
    };
    fileUpload.click();
  }

}
