import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ApiDogService } from './services/api-dog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.likedDogsSubscription) {
      this.likedDogsSubscription.unsubscribe();
    }
  }
  homeIsHovered: boolean = false;
  likersIsHovered: boolean = false;
  api = inject(ApiDogService);
  likedAnimalsLength: number = 0;
  private likedDogsSubscription!: Subscription;

  ngOnInit(): void {
    this.likedDogsSubscription = this.api.likedDogs$.subscribe((likedDogs) => {
      this.likedAnimalsLength = likedDogs.length;
    });
  }
}
