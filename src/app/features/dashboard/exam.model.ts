export interface ExamResult {
  /** Data da coleta (YYYY-MM-DD) */
  date: string;
  /** milhões/mm³ */
  hemacias?: number;
  /** g/dL */
  hemoglobina?: number;
  /** % */
  hematocrito?: number;
  /** /mm³ */
  leucocitos?: number;
  /** neutrófilos segmentados absolutos, /mm³ */
  neutrofilos?: number;
  /** linfócitos absolutos, /mm³ */
  linfocitos?: number;
  /** /mm³ */
  plaquetas?: number;
  /** mg/dL */
  creatinina?: number;
  /** mg/dL */
  ureia?: number;
  /** U/L */
  alt?: number;
  /** U/L */
  fosfataseAlcalina?: number;
}

export type ExamMetricKey = Exclude<keyof ExamResult, 'date'>;
