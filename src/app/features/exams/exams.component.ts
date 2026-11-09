import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EXAM_FILES } from './exam-files.data';
import { ExamFile } from './exam-file.model';

@Component({
  selector: 'app-exams',
  imports: [DatePipe],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss'
})
export class ExamsComponent {
  private sanitizer = inject(DomSanitizer);

  readonly files = EXAM_FILES;
  readonly labs = [...new Set(EXAM_FILES.map((f) => f.lab))];
  readonly lab = signal(this.labs[0] ?? '');
  readonly query = signal('');
  readonly selected = signal<ExamFile | null>(EXAM_FILES.find((f) => f.lab === EXAM_FILES[0]?.lab) ?? null);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const byLab = this.files.filter((f) => f.lab === this.lab());
    return q ? byLab.filter((f) => `${f.title} ${f.date}`.toLowerCase().includes(q)) : byLab;
  });

  readonly viewerUrl = computed(() => {
    const f = this.selected();
    return f ? this.sanitizer.bypassSecurityTrustResourceUrl(`${f.url}#view=FitH`) : null;
  });

  onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }

  countFor(lab: string) {
    return this.files.filter((f) => f.lab === lab).length;
  }

  selectLab(lab: string) {
    this.lab.set(lab);
    this.selected.set(this.files.find((f) => f.lab === lab) ?? null);
  }

  select(file: ExamFile) {
    this.selected.set(file);
  }
}

