import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {filter} from "rxjs/operators";
import {Observable, of, ReplaySubject} from "rxjs";
import {Customer} from "./customer.model";
import {TableColumn} from "../../../@dg/models/table-column.interface";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {aioTableData, aioTableLabels} from "../../../static-data/aio-table-data";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSelectChange} from "@angular/material/select";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    constructor(public authService: AuthenticationService) {
    }

    ngOnInit() {
    }
}
