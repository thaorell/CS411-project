import { Restaurant } from '../../Restaurant';

export class TripModel {
  constructor(
  public userId: String,
  public name: String,
  public restaurants: Restaurant[],
  public isComplete:  Boolean,
  public  _id?: string,
  ) { }
}
