import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import {Observable} from 'rxjs';

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

    getNews():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/news`);
    }
  addNews(payload:any):Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}/news`,payload);
  }
  deleteNews(id:any):Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}/news/${id}`);
  }
  allImages():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/images`);
  }

  addImages(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file)); // must match 'files' in NestJS

    return this.httpClient.post(`${environment.apiUrl}/images/upload`, formData, {
      reportProgress: true,
      observe: 'events', // needed for upload progress
    });
  }

  deleteImage(id:any):Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}/images/${id}`);
  }

  getSliders():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/sliders`);
  }

  uploadSlide(formData: FormData): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/sliders`, formData);
  }

  deleteSlider(id:any):Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}/sliders/${id}`);
  }

  getContacts():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/contact`);
  }
  patchContacts(payload:any):Observable<any>{
    return this.httpClient.patch(`${environment.apiUrl}/contact`,payload);
  }

  getAllQr():Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/discount-qrcode`);
  }
  readQR(qrCode:any):Observable<any>{
      return this.httpClient.get(`${environment.apiUrl}/discount-qrcode/redeem/${qrCode}`);
  }
  login(creds:any):Observable<any>{
      return this.httpClient.post(`${environment.apiUrl}/auth/login`,creds);
  }
  getQRDiscount(){
      return this.httpClient.post(`${environment.apiUrl}/discount-qrcode`,{});
  }

}
