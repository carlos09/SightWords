import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  constructor(private http: HttpClient) {}

  transcribeAudio(blob: Blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'speech.webm');

    return firstValueFrom(
      this.http.post<{ text: string }>('http://localhost:3000/speech', formData)
    );
  }
}
