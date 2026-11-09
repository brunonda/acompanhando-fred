export interface ExamFile {
  /** Data do exame (YYYY-MM-DD) */
  date: string;
  /** Laboratório / clínica */
  lab: string;
  title: string;
  /** Caminho relativo a partir da raiz do site */
  url: string;
  sizeMb: number;
}
