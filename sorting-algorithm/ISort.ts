import { IComparator } from './IComparator';

export interface ISort<T> {
  (a: T[], c: IComparator<T>): void;
}
