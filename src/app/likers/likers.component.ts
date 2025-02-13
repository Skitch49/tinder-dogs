import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiDogService } from '../services/api-dog.service';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-likers',
  standalone: true,
  imports: [CardComponent, FormsModule],
  templateUrl: './likers.component.html',
  styleUrl: './likers.component.scss',
})
export class LikersComponent implements OnInit {
  search: any = '';
  animalsLiked: any[] = [];
  api = inject(ApiDogService);


  ngOnInit(): void {
    this.animalsLiked = this.api.getLikedDogs();
  }
  get filtredAnimalsLiked() {
    return this.animalsLiked.filter((animal) => {
      return animal.name
        .trim()
        .toLowerCase()
        .includes(this.search.trim().toLowerCase());
    });
  }

  deleteLocalStorage() {
    this.api.resetlikedDog();
    this.animalsLiked = [];
  }
}
