import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiDogService {
  apiUrl = 'https://api.api-ninjas.com/v1/dogs';
  apiKey = environment.apiKey;

  private likedDogsSubject = new BehaviorSubject<string[]>(
    this.loadLikedDogs()
  );
  likedDogs$ = this.likedDogsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-Api-Key', this.apiKey);
  }

  getDogs(minHeight: number, offsetNumber: number) {
    return this.http.get(
      `${this.apiUrl}?min_height=${minHeight}&offset=${offsetNumber}`,
      {
        headers: this.getHttpHeaders(),
      }
    );
  }

  private loadLikedDogs(): string[] {
    return JSON.parse(localStorage.getItem('likes') || '[]');
  }

  addLikedDog(dog: string) {
    const updatedLikes = [...this.likedDogsSubject.value, dog];
    this.likedDogsSubject.next(updatedLikes);
    localStorage.setItem('likes', JSON.stringify(updatedLikes));
  }

  resetlikedDog() {
    this.likedDogsSubject.next([]);
    localStorage.setItem('likes', JSON.stringify([]));
  }

  getLikedDogs(): string[] {
    return this.likedDogsSubject.value;
  }
}
