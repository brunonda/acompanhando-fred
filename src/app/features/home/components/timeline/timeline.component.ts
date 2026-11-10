import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

export interface Milestone {
  clinic: string;
  /** Data do primeiro exame (YYYY-MM-DD) */
  date: string;
}

@Component({
  selector: 'app-timeline',
  imports: [DatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  readonly milestones = input.required<Milestone[]>();
}
