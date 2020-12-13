import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {UserService} from "../../../../../@dg/services/user.service";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'dg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup
  inputType = 'password';
  visible = false;
  isLoading: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = false
    this.form = this.userService.initForm()
    this.userService.user$
        .pipe(
            takeWhile(user => !user, true),
        )
        .subscribe(user => {
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
}
