import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../@vex/services/auth.service";

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthenticationService) { }

  ngOnInit(): void {
  }

}
