import ActorIssue from "@/model/actorIssue";

export default class Exchange {
  issue: string;
  rabbit: ActorIssue;
  turtle: ActorIssue;
  private _mds = 0.0;

  constructor(issue: string, rabbit: ActorIssue, turtle: ActorIssue) {
    this.issue = issue;
    this.rabbit = rabbit;
    this.turtle = turtle;
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

  get mds(): number {
    this.calcMds();
    return this._mds;
  }

  get i(): ActorIssue {
    return this.turtle;
  }

  get j(): ActorIssue {
    return this.rabbit;
  }
}
