import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) { }

  get(path, query){
    return this.http.get(path);
  }
  post(path, data){
    return this.http.post(path, data);
  }
}