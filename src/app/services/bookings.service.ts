import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BookingsService {
  http = inject(HttpClient);

  getAreas():Observable<any> {
    return this.http.get(`${environment.apiUrl}/area`);
  }
  getTablesOfArea(areaId:number):Observable<any> {
    return this.http.get(`${environment.apiUrl}/tables/area/${areaId}`);
  }
  getAvailableTablesOfArea(areaId:number, date:any):Observable<any> {
    return this.http.get(`${environment.apiUrl}/reservations/free-tables-area/${areaId}/${date}`);
  }
  getFreeSlotsOfTable(table:number, date:any, duration:number):Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/reservations/free-slots-table/${table}/${date}`,
      { params: { duration: duration.toString() } }
    );
  }
  book(payload:any):Observable<any> {
    return this.http.post(`${environment.apiUrl}/reservations`,payload);
  }

  findAllTablesByAreaID(areaId:number,date:string):Observable<any> {
    return this.http.get(`${environment.apiUrl}/reservations/men/${areaId}/${date}`);
  }
  getReservationByQR(code:string):Observable<any>{
    return this.http.get(`${environment.apiUrl}/reservations/${code}`);
  }
}
