import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  recipes = [];
  recipeSearch = new FormControl();
  suggestions: Observable<string[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private recipesService : RecipesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.recipesService.getRandomRecipes().pipe(takeUntil(this.destroy$))
    .subscribe((data: any[])=>{
      this.recipes = data;
    });

    this.suggestions = this.recipeSearch.valueChanges
    .pipe(
      debounceTime(300),
      switchMap(value => this.recipesService.getRecipesSuggestions(value))
    )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  searchRecipes(recipeName: string) {
    this.router.navigate(['results', { name: recipeName, page: 1 } ]);
  }

}
