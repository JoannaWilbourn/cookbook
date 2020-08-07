import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  recipes = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private recipeService : RecipesService) { }

  ngOnInit(): void {
    this.recipeService.getRandomRecipes().pipe(takeUntil(this.destroy$))
    .subscribe((data: any[])=>{
      console.log(data);
      this.recipes = data;
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
