import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SightWord } from '../models/sight-word.model';

@Injectable({
  providedIn: 'root',
})
export class SightWordService {
  constructor(private http: HttpClient) {}

  getSightWords(): Observable<SightWord[]> {
    console.log('get!');
    return this.http.get<SightWord[]>('data/sight-words.json');
  }
}
