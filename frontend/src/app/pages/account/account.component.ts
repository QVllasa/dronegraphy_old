import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../@dg/services/auth.service";
import {IUser, User} from "../../../@dg/models/user.model";
import {filter, switchMap, take, takeWhile} from "rxjs/operators";
import {AngularFireAuth} from "@angular/fire/auth";
import {MatSnackBar} from "@angular/material/snack-bar";

import {UserService} from "../../../@dg/services/user.service";
import {concat, from, Observable, of, ReplaySubject} from "rxjs";
import {Customer} from "./customer.model";
import {TableColumn} from "../../../@dg/models/table-column.interface";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {aioTableData, aioTableLabels} from "../../../static-data/aio-table-data";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {untilDestroyed} from "@ngneat/until-destroy";
import {MatSelectChange} from "@angular/material/select";


@Component({
    selector: 'dg-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
    data$: Observable<Customer[]> = this.subject$.asObservable();
    customers: Customer[];

    @Input()
    columns: TableColumn<Customer>[] = [
        { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
        { label: 'Image', property: 'image', type: 'image', visible: true },
        { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
        { label: 'First Name', property: 'firstName', type: 'text', visible: false },
        { label: 'Last Name', property: 'lastName', type: 'text', visible: false },
        { label: 'Contact', property: 'contact', type: 'button', visible: true },
        { label: 'Address', property: 'address', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Street', property: 'street', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Zipcode', property: 'zipcode', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'City', property: 'city', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Phone', property: 'phoneNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
        { label: 'Labels', property: 'labels', type: 'button', visible: true },
        { label: 'Actions', property: 'actions', type: 'button', visible: true }
    ];
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    dataSource: MatTableDataSource<Customer> | null;
    selection = new SelectionModel<Customer>(true, []);
    searchCtrl = new FormControl();

    labels = aioTableLabels;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    orders: { amount: number, date: Date, method: string }[] = [
        {
            amount: 5,
            date: new Date(),
            method: 'PayPal'
        },
        {
            amount: 5,
            date: new Date(),
            method: 'PayPal'
        },
        {
            amount: 5,
            date: new Date(),
            method: 'PayPal'
        }
    ];

    form: FormGroup;
    currentUser: User = null;
    isLoading: boolean;

    inputType = 'password';
    visible = false;

    constructor(private fb: FormBuilder,
                private afAuth: AngularFireAuth,
                private _snackBar: MatSnackBar,
                private userService: UserService,
                public authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.isLoading = false
        this.initForm();
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

        //+++++++++++++++++++++++

        this.getData().subscribe(customers => {
            this.subject$.next(customers);
        });

        this.dataSource = new MatTableDataSource();

        this.data$.pipe(
            filter<Customer[]>(Boolean)
        ).subscribe(customers => {
            this.customers = customers;
            this.dataSource.data = customers;
        });

        this.searchCtrl.valueChanges.subscribe(value => this.onFilterChange(value));

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
            }),
            password: new FormControl({
                value: '',
                disabled: false
            }, [Validators.minLength(8)]),
        })
    }

    changeUserInfo(user: User): Observable<IUser | null> {
        return this.userService.updateUser(user)
    }

    changeUserEmail(user: User): Observable<void> {
        return this.afAuth.authState.pipe(
            switchMap((res) => {
                return from(res.updateEmail(user.email))
            })
        )
    }

    changePassword(newPassword): Observable<void> {
        if ((newPassword != '') && !this.form.get('password').invalid) {
            return this.afAuth.authState.pipe(
                switchMap(res => {
                        return from(res.updatePassword(newPassword));
                    }
                )
            )
        }
        return of(null)
    }

    send() {
        this.form.disable()
        if (this.form.get('info').invalid) {
            this.form.get('password').enable()
            this._snackBar.open('Bitte korrekt ausfüllen.', 'SCHLIESSEN');
            return
        }
        this.isLoading = true;
        const newEmail = this.form.get('info.email').value
        const newPassword = this.form.get('password').value
        const lastName = this.form.get('info.lastName').value;
        const firstName = this.form.get('info.firstName').value;

        this.currentUser.email = newEmail;
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;

        const changeUserInfo$ = this.changeUserInfo(this.currentUser).pipe(take(1));
        const changeEmail$ = this.changeUserEmail(this.currentUser).pipe(take(1));
        const changePw$ = this.changePassword(newPassword).pipe(take(1));

        const combined$ = concat(
            changeEmail$,
            changeUserInfo$,
            changePw$
        )

        combined$.subscribe(() => {
                this.form.get('password').enable()

                this.isLoading = false;
                this.form.patchValue({
                    info: {
                        email: this.currentUser.email,
                        firstName: this.currentUser.firstName,
                        lastName: this.currentUser.lastName,
                    },
                    password: ''
                })
                this._snackBar.open('Benutzerdaten aktualisiert.', 'SCHLIESSEN')
            },
            err => {
                if (err) {
                    this.isLoading = false;

                    switch (err.code) {
                        case 'auth/requires-recent-login': {
                            this._snackBar.open('Bitte melde dich erst kurz neu an.', 'SCHLIESSEN');
                            break;
                        }
                        case 'auth/email-already-in-use': {
                            this._snackBar.open('Diese E-Mail wird schon verwendet.', 'SCHLIESSEN');
                            break;
                        }
                        case 'auth/invalid-email': {
                            this._snackBar.open('E-Mail Adresse unzulässig.', 'SCHLIESSEN');
                            break;
                        }
                        default: {
                            this._snackBar.open('Unbekannter Fehler', 'SCHLIESSEN');
                        }
                    }
                }
            });

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

    onActivateForm(type) {
        this.form.get('info.' + type).enable();
    }

    onDeactivateForm(type) {
        this.form.get('info.' + type).disable();
    }

//     +++++++++++++++++++++++++++++++++++++++++

    get visibleColumns() {
        return this.columns.filter(column => column.visible).map(column => column.property);
    }

    /**
     * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
     * We are simulating this request here.
     */
    getData() {
        return of(aioTableData.map(customer => new Customer(customer)));
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    createCustomer() {

    }

    updateCustomer(customer: Customer) {

    }

    deleteCustomer(customer: Customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
        this.selection.deselect(customer);
        this.subject$.next(this.customers);
    }

    deleteCustomers(customers: Customer[]) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        customers.forEach(c => this.deleteCustomer(c));
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
            return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column, event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        column.visible = !column.visible;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    onLabelChange(change: MatSelectChange, row: Customer) {
        const index = this.customers.findIndex(c => c === row);
        this.customers[index].labels = change.value;
        this.subject$.next(this.customers);
    }
}
