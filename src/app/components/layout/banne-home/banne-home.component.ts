import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-banne-home',
    imports: [RouterModule],
    templateUrl: './banne-home.component.html',
    styleUrl: './banne-home.component.scss'
})
export class BanneHomeComponent implements OnInit {

  #router = inject(Router);

  show = signal(true);

  ngOnInit(): void {
    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.show.set((this.#router.url === '/'));
    });
  }

  

}
