import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../@dg/services/user.service";
import {Router} from "@angular/router";
import {SearchService} from "../../../../@dg/services/search.service";

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
