import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { EventService } from 'src/app/services/event.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categories: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private eventService: EventService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<EventComponent>,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      ProductId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }

    this.getCategories();
  }

  getCategories() {
    this.productService.getProducts().subscribe(
      (resp: any) => {
        this.categories = resp.data;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else if (this.dialogAction === 'Add') {
      this.add();
    }
  }

  add() {
    let formData = this.productForm.value;
    let data = {
      name: formData.name,
      ProductID: formData.ProductId,
      price: formData.price,
      description: formData.description,
    };

    this.eventService.add(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    let formData = this.productForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name,
      ProductID: formData.ProductId,
      price: formData.price,
      description: formData.description,
    };

    this.eventService.update(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  delete() {}
}
