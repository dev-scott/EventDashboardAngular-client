import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  url: string = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(`${this.url}/event/add`, data, this.jsonHeader);
  }

  update(data: any) {
    return this.http.patch(`${this.url}/event/update`, data, this.jsonHeader);
  }

  getEvents() {
    return this.http.get(`${this.url}/event/get`);
  }

  updateStatus(data: any) {
    return this.http.patch(
      `${this.url}/event/updateStatus`,
      data,
      this.jsonHeader
    );
  }

  delete(id: any) {
    return this.http.delete(
      `${this.url}/event/delete/${id}`,
      this.jsonHeader
    );
  }

  getEventsByCategory(id: any) {
    return this.http.get(`${this.url}/event/getByCategoryID/${id}`);
  }

  getById(id: any) {
    return this.http.get(`${this.url}/event/getByID/${id}`);
  }
}
