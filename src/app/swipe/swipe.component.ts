import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiDogService } from '../services/api-dog.service';
import { CardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-swipe',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './swipe.component.html',
  styleUrl: './swipe.component.scss',
})
export class SwipeComponent implements OnInit {
  @ViewChild('loader') loaderElem!: any;
  dogs: any = [];
  likedDogs: any[] = [];
  isAnimating: boolean = false;
  isLoadingDogs: boolean = false;
  DISTANCE_FOR_DECISION: number = 80;
  pullDeltaX: number = 0;
  startX: number = 0;
  currentX: number = 0;
  isDragging: boolean = false;
  currentDog: any;
  currentCard: HTMLElement | null = null;
  choiceLike: any;
  choiceNope: any;
  api = inject(ApiDogService);
  offsetNumberApi!: number; // nrb random btw 0 and 280
  firstOffset!: number;
  private likedDogsSubscription!: Subscription;

  ngOnInit(): void {
    if (!localStorage.getItem('currentOffset')) {
      console.log('in localstorage');
      this.offsetNumberApi = Math.round(Math.random() * 280);
      this.firstOffset = this.offsetNumberApi;
      localStorage.setItem('firstOffset', JSON.stringify(this.firstOffset));
      localStorage.setItem(
        'currentOffset',
        JSON.stringify(this.offsetNumberApi)
      );
    } else {
      this.firstOffset = JSON.parse(localStorage.getItem('firstOffset') || '0');
      this.offsetNumberApi = JSON.parse(
        localStorage.getItem('currentOffset') || '0'
      );
    }
    this.getDogs(1);
    console.log('currentOffset  ' + this.offsetNumberApi);
    console.log('firstOffest  ' + this.firstOffset);
    console.log('-------------------');

    this.loadLikedDogs();
  }

  ngOnDestroy(): void {
    if (this.likedDogsSubscription) {
      this.likedDogsSubscription.unsubscribe();
    }
  }

  getDogs(minHeight: number) {
    return this.api.getDogs(minHeight, this.offsetNumberApi).subscribe({
      next: (data) => {
        this.dogs = data;
        if (this.loaderElem.nativeElement.classList.contains('loader')) {
          this.loaderElem.nativeElement.classList.remove('loader');
        }
        this.isLoadingDogs = false;
      },
      error: (error) => {
        console.log(error);
        this.offsetNumberApi = (this.offsetNumberApi - 20) % 262;
        this.isLoadingDogs = false;
      },
    });
  }

  onDragStart(dog: any, e: MouseEvent | TouchEvent) {
    if (this.isAnimating) return;
    this.isDragging = true;
    this.currentCard = (e.target as HTMLElement).closest('.card');
    this.choiceLike = this.currentCard!.querySelector('.choice.like');
    this.choiceNope = this.currentCard!.querySelector('.choice.nope');

    this.currentDog = dog;

    // get initial position of mouse or finger
    this.startX = (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
  }
  onMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    //current Position
    this.currentX =
      (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
    // Distance between initial and current position
    this.pullDeltaX = this.currentX - this.startX;

    const deg = this.pullDeltaX / 10;
    if (this.currentCard) {
      this.currentCard.style.transform = `translateX(${this.pullDeltaX}px) rotate(${deg}deg)`;
      this.currentCard.style.cursor = 'grabbing';

      // change opacity of choice info
      const opacity = Math.abs(this.pullDeltaX) / 100;
      const isRight = this.pullDeltaX > 0;

      const choiceEl: any = isRight ? this.choiceLike : this.choiceNope;
      choiceEl.style.opacity = opacity;
    }
  }
  onEnd(e: Event) {
    const decisionMade =
      Math.abs(this.pullDeltaX) >= this.DISTANCE_FOR_DECISION;
    if (decisionMade) {
      const currentDogIndex = this.dogs.indexOf(this.currentDog);
      if (this.pullDeltaX > 0) {
        this.currentCard?.classList.add('go-right');
        this.api.addLikedDog(this.currentDog);
        this.currentCard?.addEventListener(
          'transitionend',
          () => {
            this.dogs = [
              ...this.dogs.slice(0, currentDogIndex),
              ...this.dogs.slice(currentDogIndex + 1),
            ];
            this.resetCard();
          },
          { once: true }
        );
      } else if (this.pullDeltaX < 0) {
        this.currentCard?.classList.add('go-left');
        this.currentCard?.addEventListener(
          'transitionend',
          () => {
            this.dogs = [
              ...this.dogs.slice(0, currentDogIndex),
              ...this.dogs.slice(currentDogIndex + 1),
            ];
            this.resetCard();
          },
          { once: true }
        );
      }
      this.loadOthersDogs();
    } else {
      this.resetCard();
      if (this.choiceLike) {
        this.choiceLike.style.opacity = 0;
      }
      if (this.choiceNope) {
        this.choiceNope!.style.opacity = 0;
      }
    }
  }
  like() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const card = document.querySelector('.card:last-child');

    if (!card) {
      this.isAnimating = false;
      return;
    }

    const choice = card.querySelector('.choice.like') as HTMLElement;
    if (choice) {
      choice.style.opacity = '1';
    }

    card.classList.add('go-right');

    card.addEventListener(
      'transitionend',
      () => {
        const dogLike = this.dogs[0];
        if (dogLike) {
          this.api.addLikedDog(dogLike);
          this.likedDogs.push();

          this.dogs = this.dogs.slice(1);
        }
        this.isAnimating = false;
      },
      { once: true }
    );

    this.loadOthersDogs();
  }

  dislike() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const card = document.querySelector('.card:last-child');
    if (!card) {
      this.isAnimating = false;
      return;
    }

    const choice: any = card.querySelector('.choice.nope');
    if (choice) {
      choice.style.opacity = 1;
    }

    card.classList.add('go-left');
    card.addEventListener(
      'transitionend',
      () => {
        this.dogs = this.dogs.slice(1);
        this.isAnimating = false;
      },
      { once: true }
    );

    this.loadOthersDogs();
  }
  resetCard() {
    this.isDragging = false;
    if (this.currentCard) {
      this.currentCard.style.transform = 'none';
      this.currentCard.style.cursor = 'grab';
    }
    this.currentCard = null;
    this.currentX = 0;
    this.startX = 0;
    this.currentDog = null;
  }

  loadLikedDogs() {
    this.likedDogsSubscription = this.api.likedDogs$.subscribe((likedDogs) => {
      this.likedDogs = likedDogs;
    });
  }
  loadOthersDogs() {
    if (this.isLoadingDogs) return;
    this.isLoadingDogs = true;
    this.offsetNumberApi++;
    localStorage.setItem('currentOffset', JSON.stringify(this.offsetNumberApi));
    console.log('currentOffset  ' + this.offsetNumberApi);
    console.log('firstOffest  ' + this.firstOffset);
    if (this.dogs.length <= 1) {
      if (this.offsetNumberApi === this.firstOffset) {
        console.log('FIN DE LA BOUCLE');

        this.loaderElem.nativeElement.innerText =
          "Je n'ai plus de chien a te proposer...";
        return;
      } else {
        if (this.offsetNumberApi >= 281) {
          console.log('APPEL API MAX');
          this.offsetNumberApi = 0;
          localStorage.setItem(
            'currentOffset',
            JSON.stringify(this.offsetNumberApi)
          );
          this.getDogs(1);
        } else {
          console.log('APPEL API');

          this.getDogs(1);
        }
      }
      this.loaderElem.nativeElement.classList.add('loader');
    } else {
      this.isLoadingDogs = false;
    }
  }
}
