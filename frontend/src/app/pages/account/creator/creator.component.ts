import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of, ReplaySubject} from "rxjs";
import {TableColumn} from "../../../../@dg/models/table-column.interface";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {aioTableLabels} from "../../../../static-data/aio-table-data";
import {AuthenticationService} from "../../../../@dg/services/auth.service";
import {filter, takeWhile} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";
import {Video} from "../../../../@dg/models/video.model";
import {User} from "../../../../@dg/models/user.model";

@Component({
  selector: 'dg-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  @Input() form: FormGroup;
  currentUser: User = null;
  fileToUpload: File = null;

  isLoading: boolean;

  inputType = 'password';
  visible = false;

  subject$: ReplaySubject<Video[]> = new ReplaySubject<Video[]>(1);
  data$: Observable<Video[]> = this.subject$.asObservable();
  videos: Video[];

  @Input()
  columns: TableColumn<Video>[] = [
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
  dataSource: MatTableDataSource<Video> | null;
  selection = new SelectionModel<Video>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;


  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];



  constructor(public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.isLoading = false
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

    this.getData().subscribe(videos => {
      this.subject$.next(videos);
    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
        filter<Video[]>(Boolean)
    ).subscribe(videos => {
      this.videos = videos;
      this.dataSource.data = videos;
    });

    this.searchCtrl.valueChanges.subscribe(value => this.onFilterChange(value));

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
    return of(null
        // aioTableData.map(video => new Video(video))
    );
  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  createVideo() {

  }

  updateVideo(video: Video) {

  }

  deleteVideo(video: Video) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.videos.splice(this.videos.findIndex((existingVideo) => existingVideo.id === video.id), 1);
    this.selection.deselect(video);
    this.subject$.next(this.videos);
  }

  deleteVideos(videos: Video[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    videos.forEach(c => this.deleteVideo(c));
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

  onLabelChange(change: MatSelectChange, row: Video) {
    const index = this.videos.findIndex(c => c === row);
    // this.videos[index].labels = change.value;
    this.subject$.next(this.videos);
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
