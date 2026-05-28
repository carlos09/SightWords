import { Component, Input } from '@angular/core';
import { SightWord } from '../../models/sight-word.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sight-word-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './sight-word-card.component.html',
  styleUrl: './sight-word-card.component.scss',
})
export class SightWordCardComponent {
  @Input() word: SightWord | null = null;

  @Input() size: 'small' | 'large' = 'small';
}
