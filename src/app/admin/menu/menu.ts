import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterComponent } from "../../shared/notify/notify";
import { ToastService } from '../../shared/toast.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  imports: [NgClass, FormsModule, ReactiveFormsModule, ToasterComponent, TranslatePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone: true,
})
export class Menu implements OnInit {
  adminService = inject(AdminService);
  categories: any;
  productOfCategory: any;
  showCreateCategory = false;
  newCategoryName: string = '';
  showCreateProduct = false;
  productForm: FormGroup;
  editingProduct: any = null; // keeps track of product being edited
  toastService = inject(ToastService);
  translate = inject(TranslateService);
  changeRef = inject(ChangeDetectorRef);
  categorySelected: any;
  showEditCategory: boolean = false;
  editingCategoryId: string | null = null;
  editedCategoryName: string = '';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit() {
    this.loadCategories();
  }
  loadCategories() {
    this.adminService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;

        if (this.categorySelected) {
          // find the updated category from the new list by ID
          const updated = this.categories.find(
            (c: { id: any; }) => c.id === this.categorySelected.id
          );
          if (updated) {
            this.categorySelected = updated;
            this.productOfCategory = updated;
          }
        }

        this.changeRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  selectCategory(category: any) {
    this.productOfCategory = null;
    this.categorySelected = category;
    this.productOfCategory = category;
  }


  createOrUpdateCategory() {
    if (!this.newCategoryName.trim()) return;

    if (this.editingCategoryId) {
      this.adminService.editCategory(this.editingCategoryId, { name: this.newCategoryName }).subscribe({
        next: () => {
          this.loadCategories(); // reload list only
          const message = this.translate.instant('toast.success.operation_successful');
          this.toastService.show(message, 'success');
        },
        error: () => {
          const message = this.translate.instant('toast.error.operation_failed');
          this.toastService.show(message, 'error');
        }
      });
    } else {
      this.adminService.createCategory({ name: this.newCategoryName }).subscribe({
        next: () => {
          this.loadCategories();
          const message = this.translate.instant('toast.success.operation_successful');
          this.toastService.show(message, 'success');

        },
        error: () => {
          const message = this.translate.instant('toast.error.operation_failed');
          this.toastService.show(message, 'error');
        }
      });
    }
  }

  resetCategoryForm() {
    this.newCategoryName = '';
    this.editingCategoryId = null;
    this.showCreateCategory = false;
  }
  updateCategory() {
    if (!this.editingCategoryId || !this.editedCategoryName.trim()) return;

    this.adminService.editCategory(this.editingCategoryId, { name: this.editedCategoryName }).subscribe({
      next: () => {
        this.loadCategories();
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');

      },
      error: () => {
        const message = this.translate.instant('toast.error.operation_failed');
        this.toastService.show(message, 'error');
      }
    });
  }
  editProduct(product: any) {
    this.editingProduct = product;
    this.showCreateProduct = true; // show form
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price
    });
  }
  onEditCategory(category: any) {
    this.showCreateCategory = true;          // open the create input if hidden
    this.newCategoryName = category.name;
    this.editingCategoryId = category.id;    // set the category being edited
  }

  onSubmitProduct() {
    if (this.productForm.invalid) return;
    this.productOfCategory?.name // here need to click
    const formValue = this.productForm.value;

    if (this.editingProduct) {
      // Update existing product via service
      this.adminService.editProduct(formValue, this.editingProduct.id).subscribe({
        next: () => {
          // Reload categories/products from server to reflect changes
          this.loadCategories();
          // Reset form & state
          const message = this.translate.instant('toast.success.operation_successful');
          this.toastService.show(message, 'info');
          this.productForm.reset();
          this.showCreateProduct = false;
          this.editingProduct = null;
        },
        error: (error) => console.error('Error updating product:', error)
      });
    } else {
      // Create new product via service
      this.adminService.createProduct(formValue, this.productOfCategory.id).subscribe({
        next: () => {
          // Reload categories/products from server
          this.loadCategories();
          const message = this.translate.instant('toast.success.operation_successful');
          this.toastService.show(message, 'success');
          // Reset form & state
          this.productForm.reset();
          this.showCreateProduct = false;
        },
        error: (error) => console.error('Error creating product:', error)
      });
    }
  }

  deleteCategory(categoryId: string) {
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return; // user canceled

    this.adminService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.loadCategories();
        this.productOfCategory = null; // reset selected category
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
      },
      error: (error) => {
        const message = this.translate.instant('toast.error.operation_failed');
        this.toastService.show(message, 'error');
      }
    });
  }


  deleteProduct(productId: string) {
    const confirmed = confirm(this.translate.instant('toast.warning.confirm_delete_product'));
    if (!confirmed) return; // user canceled

    this.adminService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadCategories(); // reload the products list
        const message = this.translate.instant('toast.success.product_deleted');
        this.toastService.show(message, 'success');
      },
      error: (error) => {
        const message = this.translate.instant('toast.error.operation_failed');
        this.toastService.show(message, 'error');
      }
    });
  }




}
