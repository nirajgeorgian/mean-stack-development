import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  baseUri = "http://localhost:8080/api/user";
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  // error management for handling errors
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // create user
  createUser(data): Observable<any> {
    return this.http.post(this.baseUri, data).pipe(catchError(this.errorMgmt));
  }

  // Get all users
  getUsers() {
    return this.http.get(this.baseUri, { headers: this.headers });
  }

  // Get user
  getUser(id): Observable<any> {
    let url = `${this.baseUri}/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Update user
  updateUser(id, data): Observable<any> {
    let url = `${this.baseUri}/${id}`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Delete user
  deleteUser(id): Observable<any> {
    let url = `${this.baseUri}/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  uploadProfilePicture(id, data): Observable<any> {
    let url = `http://localhost:8080/api/uploads/${id}/profile-picture`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }
}
