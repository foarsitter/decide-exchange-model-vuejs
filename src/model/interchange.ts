import Exchange from "@/model/exchange";
import { maxExpectedUtility, positionForZero } from "@/model/calculations";

export default class Interchange {
  p: Exchange;
  q: Exchange;
  iDemand: Exchange;
  iSupply: Exchange;

  paretoOptimalExchange: Exchange;
  partialShiftExchange: Exchange;

  pValue = 0.9;
  rValue = 1;
  selectedActor = "";
  extraGainOrLoss = "";

  constructor(p: Exchange, q: Exchange) {
    this.p = p;
    this.q = q;

    this.iDemand = this.p;
    this.iSupply = this.q;

    this.paretoOptimalExchange = this.p;
    this.partialShiftExchange = this.q;

    this.extraGainOrLoss = "gain";
    this.selectedActor = this.p.supply.actor.name;

    this.calcSupplyDemandIssue();
  }

  get euMaxI(): number {
    this.iSupply.votingPosition = this.iSupply.demand.position;
    return maxExpectedUtility(this.iSupply, this.iDemand);
  }

  get euMaxJ(): number {
    this.jSupply.votingPosition = this.jSupply.demand.position;
    return maxExpectedUtility(this.jSupply, this.jDemand);
  }

  get jSupply(): Exchange {
    return this.iDemand;
  }

  get jDemand(): Exchange {
    return this.iSupply;
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

    this.paretoOptimalExchange = this.iSupply;
    this.partialShiftExchange = this.iDemand;
  }

  calcExchangeRatioP(): number {
    return this.paretoOptimalExchange.ExchangeRatioParetoOptimal();
  }

  calcExchangeRatioQ(): number {
    const p = this.paretoOptimalExchange;
    const q = this.partialShiftExchange;

    return (
      ((p.supply.salience + p.demand.salience) /
        (q.supply.salience + q.demand.salience)) *
      p.ExchangeRatioParetoOptimal()
    );
  }

  calcExpectedUtilityI(): number {
    return this.iDemand.Gain() - this.iSupply.Loss();
  }

  calcExpectedUtilityJ(): number {
    return this.jDemand.Gain() - this.jSupply.Loss();
  }

  swapExchanges() {
    [this.iSupply, this.iDemand] = [this.iDemand, this.iSupply];
  }

  swapParetoOptimalIssue() {
    [this.paretoOptimalExchange, this.partialShiftExchange] = [
      this.partialShiftExchange,
      this.paretoOptimalExchange
    ];
  }

  negotiate() {
    this.calcMoveByExchangeRatio();
    this.calcMoveParetoOptimal();

    if (this.partialShiftExchange.MoveExceedsDelta()) {
      this.swapParetoOptimalIssue();

      this.calcMoveParetoOptimal();
      this.calcMoveByExchangeRatio();
    }

    this.iSupply.applyMove();
    this.jSupply.applyMove();
  }

  calcMoveByExchangeRatio(): number {
    const p = this.partialShiftExchange;
    p.move =
      (this.calcExchangeRatioQ() * p.calcPowerSalience()) /
      (p.supply.actor.power * p.supply.salience);

    return p.move;
  }

  calcMoveParetoOptimal(): number {
    const q = this.paretoOptimalExchange;
    q.move = Math.abs(q.demand.position - q.supply.position);

    return q.move;
  }

  interval(): number[] {
    const eu = this.calcExpectedUtilityI();

    const x =
      eu +
      this.pValue *
        this.rValue *
        (this.extraGainOrLoss ? this.euMaxI : this.euMaxJ - eu);
    const y = eu - this.pValue * this.rValue * eu;

    return [x, y];
  }

  interval2(): number[] {
    this.pValue = 0.25;
    const eu = this.calcExpectedUtilityI();

    const x = eu + this.pValue * (this.euMaxJ - eu);

    const y = eu - this.pValue * eu;

    return [x, y];
  }

  calcParetoSwiftPoint(): number {
    return 0;
  }

  dance(): void {
    this.calcMoveParetoOptimal();
    this.calcMoveByExchangeRatio();

    this.iSupply.applyMove();
    this.jSupply.applyMove();
  }

  lowerLoss(): number {
    return this.equalGain() - this.pValue * this.equalGain();
  }

  upperGainI(): number {
    return this.equalGain() + this.pValue * (this.euMaxI - this.equalGain());
  }

  upperGainJ(): number {
    return this.equalGain() + this.pValue * (this.euMaxJ - this.equalGain());
  }

  equalGain(): number {
    this.negotiate();
    const tolerance = 0.000001;

    if (
      Math.abs(this.calcExpectedUtilityJ() - this.calcExpectedUtilityI()) >
      tolerance
    ) {
      throw Error("Gain is not equal");
    }

    return this.calcExpectedUtilityJ();
  }

  paretoFrontier(): number[][] {
    this.negotiate();

    if (this.positionForZeroGainI() < this.jDemand.demand.position) {
      this.iSupply.votingPosition = this.iSupply.demand.position;
      this.jSupply.votingPosition = this.jSupply.demand.position;

      if (this.calcExpectedUtilityI() > 0 && this.calcExpectedUtilityJ() > 0) {
        return [
          [0, this.euMaxI],
          [this.calcExpectedUtilityI(), this.calcExpectedUtilityJ()],
          [this.euMaxJ, 0]
        ];
      }
    }

    return [
      [0, this.euMaxI],
      [this.euMaxJ, 0]
    ];
  }

  positionForZeroGainI(): number {
    return positionForZero(this.iSupply, this.iDemand);
  }

  positionForZeroGainJ(): number {
    return positionForZero(this.jSupply, this.jDemand);
  }

  xyz(multiplier = 1): number[][] {
    const r = this.rValue;
    const eu = this.equalGain();

    let gain = 0;

    if (this.selectedActor == this.iSupply.demand.actor.name) {
      if (this.extraGainOrLoss == "gain") {
        gain = eu + r * (this.upperGainI() - eu);
      } else {
        gain = eu - r * (eu - this.lowerLoss());
      }

      const frontier = this.paretoFrontier();

      const y = frontier[1][1];

      if (gain < y) {
        const g = this.jSupply.Loss() + gain;

        const delta = g / this.jDemand.demand.salience;

        const loss = delta * this.jDemand.supply.salience;

        const total = Math.abs(loss - this.jSupply.Gain());

        return [
          [0, gain * multiplier],
          [total * multiplier, gain * multiplier],
          [total * multiplier, 0]
        ];
      }

      const loss = Math.abs(gain - this.iSupply.Gain());

      const delta = loss / this.iSupply.supply.salience;

      const gainJ = delta * this.jSupply.demand.salience;

      const total = Math.abs(gainJ - this.iSupply.Loss());

      return [
        [0, gain * multiplier],
        [total * multiplier, gain * multiplier],
        [total * multiplier, 0]
      ];
    }

    if (this.extraGainOrLoss == "gain") {
      gain = eu + r * (this.upperGainJ() - eu);
    } else {
      gain = eu - r * (eu - this.lowerLoss());
    }

    const frontier = this.paretoFrontier();

    const y = frontier[0][0];

    if (gain < y) {
      const g = this.iSupply.Loss() + gain;

      const delta = g / this.iDemand.demand.salience;

      const loss = delta * this.iDemand.supply.salience;

      const total = Math.abs(loss - this.iSupply.Gain());

      return [
        [0, gain * multiplier],
        [total * multiplier, gain * multiplier],
        [total * multiplier, 0]
      ];
    }

    const loss = Math.abs(gain - this.jSupply.Gain());

    const delta = loss / this.jSupply.supply.salience;

    const gainJ = delta * this.iSupply.demand.salience;

    const total = Math.abs(gainJ - this.jSupply.Loss());

    return [
      [0, gain * multiplier],
      [total * multiplier, gain * multiplier],
      [total * multiplier, 0]
    ];
  }
}
