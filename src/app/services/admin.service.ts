import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    readonly httpClient = inject(HttpClient);

    getDailyPlate() {
        return this.httpClient.get(`${environment.apiUrl}/daily-plate/today`);
    }
  getPlates() {
    return this.httpClient.get(`${environment.apiUrl}/daily-plate/days`);
  }

    updateDailyPlate(plate: any) {
        return this.httpClient.put(`${environment.apiUrl}/daily-plate`, plate);
    }
  createDailyPlate(plate: any) {
    return this.httpClient.post(`${environment.apiUrl}/daily-plate`, plate);
  }
  deleteDailyPlate(plateID: any) {
    return this.httpClient.delete(`${environment.apiUrl}/daily-plate/${plateID}`);
  }
    getCategories() {
        return this.httpClient.get(`${environment.apiUrl}/category`);
    }
    createCategory(category: any) {
        return this.httpClient.post(`${environment.apiUrl}/category`, category);
    }
    createProduct(product: any, categoryId: string) {
        return this.httpClient.post(`${environment.apiUrl}/product/${categoryId}`, product);
    }
    editProduct(product: any, productId: string) {
        return this.httpClient.put(`${environment.apiUrl}/product/${productId}`, product);
    }
    deleteCategory(categoryId: string) {
        return this.httpClient.delete(`${environment.apiUrl}/category/${categoryId}`);
    }
    deleteProduct(productId: string) {
        return this.httpClient.delete(`${environment.apiUrl}/product/${productId}`);
    }

    editCategory(categoryId: string, category: any) {
        return this.httpClient.put(`${environment.apiUrl}/category/${categoryId}`, category);
    }
}
