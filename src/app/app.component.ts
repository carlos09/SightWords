import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SightWordCardComponent } from './components/sight-word-card/sight-word-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SightWordCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SightWords';
}
