import ActorIssue from "@/model/actorIssue";

export default class Exchange {
  issue: string;
  demand: ActorIssue;
  supply: ActorIssue;
  rabbit: ActorIssue;
  turtle: ActorIssue;
  move = 0;
  public y = 0;

  constructor(issue: string, rabbit: ActorIssue, turtle: ActorIssue) {
    this.issue = issue;
    this.rabbit = rabbit;
    this.turtle = turtle;

    this.demand = this.rabbit;
    this.supply = this.turtle;
  }

  private _mds = 0.0;

  get mds(): number {
    this.calcMds();
    return this._mds;
  }

  get i(): ActorIssue {
    return this.rabbit;
  }

  get j(): ActorIssue {
    return this.turtle;
  }

  calcPowerSalience() {
    return this.rabbit.calcPowerSalience() + this.turtle.calcPowerSalience();
  }

  calcPositionPowerSalience() {
    return (
      this.rabbit.calcPositionPowerSalience() +
      this.turtle.calcPositionPowerSalience()
    );
  }

  calcMds() {
    this._mds = this.calcPositionPowerSalience() / this.calcPowerSalience();
  }

  applyMove(): void {
    if (this.supply.position > this.demand.position) {
      this.y = this.supply.position - this.move;
    } else {
      this.y = this.supply.position + this.move;
    }
  }

  newMDS(): number {
    return (
      (this.y * this.supply.salience * this.supply.actor.power +
        this.demand.position * this.demand.salience * this.demand.actor.power) /
      this.calcPowerSalience()
    );
  }
}
