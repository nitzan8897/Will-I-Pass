/* Ambient declarations for the CDN-loaded heavy libraries (ml.js, pdf.js).
   They stay out of the bundle; we only type the small surface we use. */

interface MlModelLike {
  train?(rows: number[][], labels: number[]): void;
  predict(rows: number[][]): number[];
}

interface MlNamespace {
  KNN: new (rows: number[][], labels: number[], opts: { k: number }) => MlModelLike;
  DecisionTreeClassifier: new (opts: {
    gainFunction: string;
    maxDepth: number;
    minNumSamples: number;
  }) => MlModelLike;
  FNN: new (opts: {
    hiddenLayers: number[];
    iterations: number;
    learningRate: number;
    activation: string;
  }) => MlModelLike;
  MultivariateLinearRegression: new (
    x: number[][],
    y: number[][],
  ) => { predict(row: number[]): number[] };
}

declare const ML: MlNamespace;

/* Minimal pdf.js surface used by the PDF grade loader. */
interface PdfTextItem {
  str: string;
  transform: number[];
}
interface PdfTextContent {
  items: PdfTextItem[];
}
interface PdfPage {
  getTextContent(): Promise<PdfTextContent>;
}
interface PdfDocument {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
}
interface PdfLoadingTask {
  promise: Promise<PdfDocument>;
}
interface PdfjsLib {
  getDocument(src: { data: ArrayBuffer } | string): PdfLoadingTask;
  GlobalWorkerOptions: { workerSrc: string };
}
declare const pdfjsLib: PdfjsLib;
