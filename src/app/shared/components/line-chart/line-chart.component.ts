import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface LineChartDataset {
  label: string;
  data: (number | null)[];
  color: string;
  /** Use 'y1' para plotar no eixo direito. */
  axis?: 'y' | 'y1';
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent {
  labels = input.required<string[]>();
  datasets = input.required<LineChartDataset[]>();
  leftAxisTitle = input<string>('');
  rightAxisTitle = input<string>('');

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());

    effect(() => {
      const config = this.buildConfig();
      this.chart?.destroy();
      this.chart = new Chart(this.canvas().nativeElement, config);
    });
  }

  private buildConfig(): ChartConfiguration<'line'> {
    const datasets = this.datasets();
    const hasRight = datasets.some((d) => d.axis === 'y1');

    return {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: datasets.map((d) => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color,
          yAxisID: d.axis ?? 'y',
          spanGaps: true,
          tension: 0.25,
          pointRadius: 4,
          pointHoverRadius: 6
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            position: 'left',
            beginAtZero: true,
            title: { display: !!this.leftAxisTitle(), text: this.leftAxisTitle() }
          },
          ...(hasRight
            ? {
                y1: {
                  position: 'right' as const,
                  beginAtZero: true,
                  grid: { drawOnChartArea: false },
                  title: { display: !!this.rightAxisTitle(), text: this.rightAxisTitle() }
                }
              }
            : {})
        }
      }
    };
  }
}
