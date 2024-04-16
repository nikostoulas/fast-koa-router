import * as snapshotIt from 'snap-shot-it';
declare global {
  var snapshot: typeof snapshotIt;
  namespace NodeJS {
    interface Global {
      snapshot: typeof snapshotIt;
    }
  }
}

globalThis.snapshot = snapshotIt;
