import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../@dg/services/user.service";

@Component({
  selector: 'dg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

}
