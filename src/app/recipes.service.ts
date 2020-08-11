import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { map, retry, catchError } from "rxjs/operators";
import {  throwError, of, Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  hits: 0;
  
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
    return this.httpClient.get
    (`${environment.recipeApiServer}/recipes/random?apiKey=${environment.apiKey}&number=${environment.randomRecipes}`)
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

  public getRecipesSuggestions(value : string) {
    return this.httpClient.get<Object[]>
    (`${environment.recipeApiServer}/recipes/autocomplete?apiKey=${environment.apiKey}&number=5&query=${value}`)
    .pipe(
      map(
        result => {
          let suggestions: string[];
          suggestions = result.map(x => x['title']);
          return suggestions;
        }          
      ),
      retry(3),
      catchError(this.handleError)
    );
  }

  public searchRecipes(name: string, page: number){
    const offset = (page - 1) * 12;
    return this.httpClient.get
    (`${environment.recipeApiServer}/recipes/complexSearch?apiKey=${environment.apiKey}&query=${name}&number=12&offset=${offset}`)
    .pipe(
      map(
        result => {
          this.hits = result['totalResults'];
          return (result['results']);
        }          
      ),
      retry(3),
      catchError(this.handleError)
    );
  }

  public getHits(){
    return this.hits;
  } 
}
