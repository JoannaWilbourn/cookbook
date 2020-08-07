import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { map, tap } from "rxjs/operators";
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private REST_API_SERVER = "https://api.spoonacular.com/recipes";

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
  public getRandomRecipes(){
    return this.httpClient.get(this.REST_API_SERVER + '/random?apiKey=d3cab70838f64ff6a97c94e899d1e693&number=6')
    .pipe(
      map(
        result => {
          return result['recipes'];
        }          
      ),
      retry(3),
      catchError(this.handleError)
    );
  }
}
