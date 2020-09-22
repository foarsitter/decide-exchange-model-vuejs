import Exchange from "@/model/exchange";

export default class Model {
  p: Exchange;
  q: Exchange;
  iDemand: Exchange;
  iSupply: Exchange;

  get euMaxI(): Record<string, number> {
    const supply = this.iSupply;
    const gain = this.iGain;
    const loss = this.jLoss;

    const s =
      supply.supply.salience /
      (supply.supply.salience + supply.demand.salience);

    const delta1 = loss / (supply.demand.salience * s);
    const delta2 = gain / (supply.supply.salience * s);

    const euMaxJ = supply.demand.salience * s * delta2 - loss;
    const euMaxI = gain - supply.supply.salience * s * delta1;

    return { i: euMaxI, j: euMaxJ };
  }

  get euMaxJ(): Record<string, number> {
    const supply = this.jSupply;
    const gain = this.jGain;
    const loss = this.iLoss;

    const s =
      supply.supply.salience /
      (supply.supply.salience + supply.demand.salience);

    const delta1 = loss / (supply.demand.salience * s);
    const delta2 = gain / (supply.supply.salience * s);

    const euMaxI = supply.demand.salience * s * delta2 - loss;
    const euMaxJ = gain - supply.supply.salience * s * delta1;

    return { i: euMaxI, j: euMaxJ };
  }

  constructor(p: Exchange, q: Exchange) {
    this._exchangeRatioP = 0;
    this._exchangeRatioQ = 0;
    this._expectedUtilityI = 0;
    this._expectedUtilityJ = 0;
    this.p = p;
    this.q = q;

    this.iDemand = this.p;
    this.iSupply = this.q;

    this.update();
  }

  get jDelta(): number {
    return Math.abs(this.jSupply.mds - this.jSupply.i.position);
  }

  get iDelta(): number {
    return Math.abs(this.iSupply.mds - this.iSupply.j.position);
  }

  get iLoss(): number {
    return this.iSupply.i.salience * this.iDelta;
  }

  get iGain(): number {
    return this.iDemand.i.salience * this.jDelta;
  }

  get jLoss(): number {
    return this.jSupply.j.salience * this.jDelta;
  }

  get jGain(): number {
    return this.jDemand.j.salience * this.iDelta;
  }

  get jSupply(): Exchange {
    return this.iDemand;
  }

  get jDemand(): Exchange {
    return this.iSupply;
  }

  private _expectedUtilityI: number;

  get expectedUtilityI(): number {
    return this._expectedUtilityI;
  }

  private _expectedUtilityJ: number;

  get expectedUtilityJ(): number {
    return this._expectedUtilityJ;
  }

  private _exchangeRatioP: number;

  get exchangeRatioP(): number {
    return this._exchangeRatioP;
  }

  private _exchangeRatioQ: number;

  get exchangeRatioQ(): number {
    return this._exchangeRatioQ;
  }

  calcSupplyDemandIssue() {
    const p = this.p;
    const q = this.q;

    const left = p.i.salience / q.i.salience;
    const right = p.j.salience / q.j.salience;

    if (left > right) {
      this.iDemand = this.p;
      this.iSupply = this.q;
    } else {
      this.iDemand = this.q;
      this.iSupply = this.p;
    }

    this.iDemand.demand = this.iDemand.i;
    this.iDemand.supply = this.iDemand.j;
    this.iSupply.supply = this.iSupply.i;
    this.iSupply.demand = this.iSupply.j;
  }

  calcExchangeRatioP(p: Exchange): number {
    this._exchangeRatioP =
      (Math.abs(p.demand.position - p.supply.position) *
        p.supply.salience *
        p.supply.actor.power) /
      p.calcPowerSalience();

    return this._exchangeRatioP;
  }

  calcExchangeRatioQ(p: Exchange, q: Exchange): number {
    this._exchangeRatioQ =
      ((q.supply.salience + q.demand.salience) /
        (p.supply.salience + p.demand.salience)) *
      this.exchangeRatioP;

    return this.exchangeRatioQ;
  }

  calcExpectedUtilityI(): number {
    const p = this.iSupply;
    const q = this.iDemand;

    this._expectedUtilityI = Math.abs(
      this.exchangeRatioQ * q.i.salience - this.exchangeRatioP * p.i.salience
    );
    return this.expectedUtilityI;
  }

  calcExpectedUtilityJ(): number {
    const p = this.iSupply;
    const q = this.iDemand;

    this._expectedUtilityJ = Math.abs(
      this.exchangeRatioP * p.j.salience - this.exchangeRatioQ * q.j.salience
    );

    return this.expectedUtilityJ;
  }

  update() {
    this.calcSupplyDemandIssue();

    this.calcExchangeRatioP(this.iSupply);
    this.calcExchangeRatioQ(this.jSupply, this.iSupply);

    this.calcExpectedUtilityI();
    this.calcExpectedUtilityJ();

    this.calcMoveI(this.jSupply);
    this.calcMoveJ(this.iSupply);

    const maxInterval = Math.abs(
      this.iSupply.demand.position - this.iSupply.supply.position
    );

    if (this.jSupply.move > maxInterval) {
      this.calcExchangeRatioP(this.jSupply);
      this.calcExchangeRatioQ(this.iSupply, this.jSupply);

      this.calcMoveJ(this.jSupply);
      this.calcMoveI(this.iSupply);
    }

    this.iSupply.applyMove();
    this.jSupply.applyMove();
  }

  calcMoveI(p: Exchange): number {
    p.move =
      (this.exchangeRatioQ * p.calcPowerSalience()) /
      (p.supply.actor.power * p.supply.salience);

    return p.move;
  }

  calcMoveJ(q: Exchange): number {
    q.move = Math.abs(q.demand.position - q.supply.position);

    return q.move;
  }
}
