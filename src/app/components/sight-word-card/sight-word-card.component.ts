import { Component, OnInit } from '@angular/core';
import { SightWord } from '../../models/sight-word.model';
import { SightWordService } from '../../services/sight-words.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sight-word-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './sight-word-card.component.html',
  styleUrl: './sight-word-card.component.scss',
})
export class SightWordCardComponent implements OnInit {
  words: SightWord[] = [];
  currentIndex = 0;

  recording = false;
  result = '';
  isCorrect = false;
  isProcessingSpeech = false;

  constructor(
    private sightWordService: SightWordService,
    private recorder: AudioRecorderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.sightWordService.getSightWords().subscribe((words) => {
      this.words = words;
    });
  }

  nextCard(): void {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.resetSpeechState();
    }
  }

  previousCard(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.resetSpeechState();
    }
  }

  get currentWord(): SightWord | null {
    return this.words[this.currentIndex] || null;
  }

  // ---------------------------
  // 🎤 SPEECH FEATURES
  // ---------------------------

  async startRecording() {
    if (this.recording) return;

    this.recording = true;

    await this.recorder.startRecording();
  }

  async stopRecording() {
    if (!this.recording) return;

    this.recording = false;
    this.isProcessingSpeech = true;

    const audioBlob = await this.recorder.stopRecording();

    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.webm');

    try {
      const res: any = await firstValueFrom(
        this.http.post('http://localhost:3000/speech', formData)
      );

      this.result = this.cleanTranscript(res.text);

      this.checkAnswer();
    } catch (err) {
      console.error(err);
    } finally {
      this.isProcessingSpeech = false;
    }
  }

  cleanTranscript(text: string): string {
    return text
      .replace(/\[.*?\]/g, '')
      .replace(/\n/g, '')
      .trim()
      .toLowerCase();
  }

  checkAnswer() {
    if (!this.currentWord) return;

    const spoken = this.result.toLowerCase().trim();
    const target = this.currentWord.word.toLowerCase().trim();

    this.isCorrect = spoken.includes(target);
  }

  resetSpeechState() {
    this.result = '';
    this.isCorrect = false;
  }
}
