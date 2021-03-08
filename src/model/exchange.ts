import ActorIssue from "@/model/actorIssue";

export default class Exchange {
  issue: string;
  demand: ActorIssue;
  supply: ActorIssue;

  i: ActorIssue;
  j: ActorIssue;

  public move = 0;
  public votingPosition = 0;

  constructor(issue: string, i: ActorIssue, j: ActorIssue) {
    this.issue = issue;

    this.i = i;
    this.j = j;

    this.demand = i;
    this.supply = j;

    this.demand.exchange = this;
    this.supply.exchange = this;
  }

  calcPowerSalience() {
    return this.demand.calcPowerSalience() + this.supply.calcPowerSalience();
  }

  calcPositionPowerSalience() {
    return (
      this.demand.calcPositionPowerSalience() +
      this.supply.calcPositionPowerSalience()
    );
  }

  MDS(): number {
    return this.calcPositionPowerSalience() / this.calcPowerSalience();
  }

  MDSVoting(): number {
    if (this.votingPosition === undefined) {
      throw new Error("Calculate the voting position first");
    }
    return (
      (this.votingPosition * this.supply.calcPowerSalience() +
        this.demand.calcPositionPowerSalience()) /
      this.calcPowerSalience()
    );
  }

  MDSDelta(): number {
    const mds = this.MDS();
    const mdsVoting = this.MDSVoting();

    return Math.abs(mds - mdsVoting);
  }

  applyMove(): void {
    if (this.move === undefined) {
      throw new Error("Calculate the move first of the supply actor first");
    }

    if (this.supply.position > this.demand.position) {
      this.votingPosition = this.supply.position - this.move;
    } else {
      this.votingPosition = this.supply.position + this.move;
    }
  }

  Loss(): number {
    return this.supply.salience * this.MDSDelta();
  }

  Gain(): number {
    return this.demand.salience * this.MDSDelta();
  }

  isParetoOptimal(): boolean {
    return this.votingPosition == this.demand.position;
  }

  ExchangeRatioParetoOptimal(): number {
    return (
      (this.PositionDelta() * this.supply.calcPowerSalience()) /
      this.calcPowerSalience()
    );
  }

  PositionDelta(): number {
    return Math.abs(this.demand.position - this.supply.position);
  }

  MoveExceedsDelta(): boolean {
    return this.move >= this.PositionDelta();
  }
}
