import { Component, signal } from '@angular/core';
import { EXAM_FILES } from '../exams/exam-files.data';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ClinicalSummaryComponent } from './components/clinical-summary/clinical-summary.component';
import { HomeActionsComponent } from './components/home-actions/home-actions.component';
import { Milestone, TimelineComponent } from './components/timeline/timeline.component';

@Component({
  selector: 'app-home',
  imports: [ModalComponent, HomeActionsComponent, TimelineComponent, ClinicalSummaryComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  isModalOpen = signal(false);

  /** Primeiro exame do Frederico em cada clínica, em ordem cronológica. */
  readonly milestones: Milestone[] = [...new Set(EXAM_FILES.map((f) => f.lab))]
    .map((clinic) => ({
      clinic,
      date: EXAM_FILES.filter((f) => f.lab === clinic)
        .map((f) => f.date)
        .sort()[0]
    }))
    .filter((m) => !!m.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
