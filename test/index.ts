import * as snapshotIt from 'snap-shot-it';
declare global {
  const snapshot: typeof snapshotIt;
  namespace NodeJS {
    interface Global {
      snapshot: typeof snapshotIt;
    }
  }
}

global.snapshot = snapshotIt;
