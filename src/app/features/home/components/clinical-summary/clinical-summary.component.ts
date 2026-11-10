import { Component } from '@angular/core';
import { FredericoCaseComponent } from '../frederico-case/frederico-case.component';

@Component({
  selector: 'app-clinical-summary',
  imports: [FredericoCaseComponent],
  templateUrl: './clinical-summary.component.html',
  host: { class: 'box content' }
})
export class ClinicalSummaryComponent {}
