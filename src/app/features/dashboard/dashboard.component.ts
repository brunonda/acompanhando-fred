import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import {
  LineChartComponent,
  LineChartDataset
} from '../../shared/components/line-chart/line-chart.component';
import { EXAM_RESULTS } from './exams.data';
import { ExamMetricKey, ExamResult } from './exam.model';

interface Summary {
  label: string;
  unit: string;
  value: number | null;
  date: string | null;
  trend: 'up' | 'down' | 'flat' | null;
}

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, LineChartComponent, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly results: ExamResult[] = EXAM_RESULTS;

  readonly labels = this.results.map((r) => {
    const [, month, day] = r.date.split('-');
    return `${day}/${month}`;
  });

  readonly redCells: LineChartDataset[] = [
    this.series('Hemoglobina (g/dL)', 'hemoglobina', '#d6336c'),
    this.series('Hematócrito (%)', 'hematocrito', '#f08c00')
  ];

  readonly erythrocytes: LineChartDataset[] = [
    this.series('Hemácias (milhões/mm³)', 'hemacias', '#c92a2a')
  ];

  readonly whiteCells: LineChartDataset[] = [
    this.series('Leucócitos', 'leucocitos', '#1c7ed6'),
    this.series('Neutrófilos segmentados', 'neutrofilos', '#2f9e44'),
    this.series('Linfócitos', 'linfocitos', '#7048e8')
  ];

  readonly platelets: LineChartDataset[] = [
    this.series('Plaquetas (/mm³)', 'plaquetas', '#0c8599')
  ];

  readonly kidney: LineChartDataset[] = [
    this.series('Creatinina (mg/dL)', 'creatinina', '#e8590c'),
    this.series('Ureia (mg/dL)', 'ureia', '#5c7cfa', 'y1')
  ];

  readonly liver: LineChartDataset[] = [
    this.series('ALT (U/L)', 'alt', '#862e9c'),
    this.series('Fosfatase alcalina (U/L)', 'fosfataseAlcalina', '#5f3dc4', 'y1')
  ];

  readonly summary = computed<Summary[]>(() => [
    this.summaryOf('Hemoglobina', 'g/dL', 'hemoglobina'),
    this.summaryOf('Hematócrito', '%', 'hematocrito'),
    this.summaryOf('Leucócitos', '/mm³', 'leucocitos'),
    this.summaryOf('Plaquetas', '/mm³', 'plaquetas'),
    this.summaryOf('Creatinina', 'mg/dL', 'creatinina'),
    this.summaryOf('Ureia', 'mg/dL', 'ureia')
  ]);

  readonly totalExams = this.results.length;

  private series(
    label: string,
    key: ExamMetricKey,
    color: string,
    axis: 'y' | 'y1' = 'y'
  ): LineChartDataset {
    return { label, color, axis, data: this.results.map((r) => r[key] ?? null) };
  }

  private summaryOf(label: string, unit: string, key: ExamMetricKey): Summary {
    const points = this.results.filter((r) => r[key] !== undefined);
    const last = points.at(-1);
    const prev = points.at(-2);
    if (!last) return { label, unit, value: null, date: null, trend: null };
    const value = last[key] as number;
    const before = prev?.[key];
    const trend = before === undefined ? null : value > before ? 'up' : value < before ? 'down' : 'flat';
    return { label, unit, value, date: last.date, trend };
  }
}
