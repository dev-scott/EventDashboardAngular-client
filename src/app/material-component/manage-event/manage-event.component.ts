import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EventService } from 'src/app/services/event.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { EventComponent } from '../dialog/event/event.component';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss'],
})
export class ManageEventComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'product',
    'description',
    'percentage',
    'type',
    'edit',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private eventService: EventService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.eventService.getEvents().subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(resp.data);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(EventComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (resp: any) => {
        this.tableData();
      }
    );
  }

  handleEditAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: value,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(EventComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (resp: any) => {
        this.tableData();
      }
    );
  }

  handleDeleteAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + value.name + ' event',
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (resp: any) => {
        this.ngxService.start();
        this.deleteEvent(value.id);
        dialogRef.close();
      }
    );
  }

  deleteEvent(id: any) {
    this.eventService.delete(id).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  onChange(status: any, id: any) {
    let data = {
      status: status.toString(),
      id,
    };

    this.eventService.updateStatus(data).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
