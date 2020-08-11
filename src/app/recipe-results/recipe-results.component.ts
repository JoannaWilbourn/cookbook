import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-recipe-results',
  templateUrl: './recipe-results.component.html',
  styleUrls: ['./recipe-results.component.scss']
})
export class RecipeResultsComponent implements OnInit {

  recipes;
  hits = 0;
  recipeName;
  destroy$: Subject<boolean> = new Subject<boolean>();
  pageEvent: PageEvent;
  navigationSubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService : RecipesService    
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.route.params.subscribe( 
          params => {
            if (params["name"] && params["page"])
            {
              this.recipeName = params["name"];
              this.recipesService.searchRecipes(this.recipeName, +params["page"]).pipe(takeUntil(this.destroy$))
              .subscribe(data =>{
                this.recipes = data;
                this.hits = this.recipesService.getHits();
              });
            }
          }
        );
      }
    }); 
   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  changePage(event?:PageEvent) {
    const currentPage = event.pageIndex + 1;
    this.router.navigate(['results', { name: this.recipeName, page: currentPage } ]);
  }

}
