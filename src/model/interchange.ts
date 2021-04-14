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
  rValue = 0.5;
  selectedActor = "";
  extraGainOrLoss = "loss";

  constructor(p: Exchange, q: Exchange) {
    this.p = p;
    this.q = q;

    this.iDemand = this.p;
    this.iSupply = this.q;

    this.paretoOptimalExchange = this.p;
    this.partialShiftExchange = this.q;

    this.selectedActor = this.p.demand.actor.name;
    this.calcSupplyDemandIssue();
  }

  zeroUtilityI(): number {
    const deltaMDS = this.zeroUtilityIDeltaMDS();

    return (
      deltaMDS * this.partialShiftExchange.demand.salience -
      this.paretoOptimalExchange.Loss()
    );
  }

  zeroUtilityIDeltaMDS(): number {
    const newLoss = this.paretoOptimalExchange.Gain();

    return newLoss / this.partialShiftExchange.supply.salience;
  }

  zeroUtilityIPosition(): number {
    const deltaMDS = this.zeroUtilityIDeltaMDS();

    const newMDS = this.partialShiftExchange.MDS() - deltaMDS;

    return (
      (newMDS * this.partialShiftExchange.calcPowerSalience() -
        this.partialShiftExchange.demand.calcPowerSalience()) /
      this.partialShiftExchange.supply.calcPowerSalience()
    );
  }

  zeroUtilityJDeltaMDS(): number {
    const newGain = this.paretoOptimalExchange.Loss();

    return newGain / this.partialShiftExchange.demand.salience;
  }

  zeroUtilityJPosition(): number {
    const deltaMDS = this.zeroUtilityJDeltaMDS();
    const newMDS = this.partialShiftExchange.MDS() - deltaMDS;

    return (
      (newMDS * this.partialShiftExchange.calcPowerSalience() -
        this.partialShiftExchange.demand.calcPowerSalience()) /
      this.partialShiftExchange.supply.calcPowerSalience()
    );
  }

  zeroUtilityJ(): number {
    const deltaMDS = this.zeroUtilityJDeltaMDS();

    return (
      this.paretoOptimalExchange.Gain() -
      deltaMDS * this.partialShiftExchange.supply.salience
    );
  }

  hasOffset(): boolean {
    const posI = this.zeroUtilityIPosition();
    const posJ = this.zeroUtilityJPosition();

    return !(posI >= 0 && posI <= 100 && posJ >= 0 && posJ <= 100);
  }

  get euMaxI(): number {
    if (!this.hasOffset()) {
      return this.zeroUtilityI();
    }

    this.iSupply.votingPosition = this.iSupply.demand.position;
    return maxExpectedUtility(this.iSupply, this.iDemand);
  }

  get euMaxJ(): number {
    if (!this.hasOffset()) {
      return this.zeroUtilityJ();
    }

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
    this.calcSupplyDemandIssue();
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
      // this.jSupply.votingPosition = this.jSupply.demand.position;

      if (this.calcExpectedUtilityI() > 0 && this.calcExpectedUtilityJ() > 0) {
        return [
          [0, this.euMaxI],
          [this.calcExpectedUtilityI(), this.calcExpectedUtilityJ()],
          [this.euMaxJ, 0]
        ];
      }
    }

    if (this.positionForZeroGainJ() < this.iDemand.demand.position) {
      this.jSupply.votingPosition = this.jSupply.demand.position;
      // this.jSupply.votingPosition = this.jSupply.demand.position;

      if (this.calcExpectedUtilityJ() > 0 && this.calcExpectedUtilityI() > 0) {
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

  rexI(multiplier = 1): number[][] {
    const r = this.rValue;
    const eu = this.equalGain();

    let utility;

    if (this.extraGainOrLoss == "gain") {
      utility = eu + r * (this.upperGainI() - eu);
    } else {
      utility = eu - r * (eu - this.lowerLoss());
    }

    const frontier = this.paretoFrontier();

    const y = frontier[1][1];

    if (frontier.length == 3) {
      if (this.extraGainOrLoss == "gain") {
        if (y < utility) {
          this.swapParetoOptimalIssue();

          const loss = this.paretoOptimalExchange.Gain() - utility;

          const delta = loss / this.partialShiftExchange.supply.salience;

          const gain = delta * this.partialShiftExchange.demand.salience;

          const total = Math.abs(gain - this.paretoOptimalExchange.Loss());

          return [
            [0, utility * multiplier],
            [total * multiplier, utility * multiplier],
            [total * multiplier, 0]
          ];
        }

        const gain = this.paretoOptimalExchange.Loss() + utility;

        const delta = gain / this.partialShiftExchange.demand.salience;

        const loss = delta * this.partialShiftExchange.supply.salience;

        const total = Math.abs(this.paretoOptimalExchange.Gain() - loss);

        return [
          [0, utility * multiplier],
          [total * multiplier, utility * multiplier],
          [total * multiplier, 0]
        ];
      } else {
        if (y < utility) {
          this.swapParetoOptimalIssue();
        }

        const gain = this.paretoOptimalExchange.Loss() + utility;

        const delta = gain / this.partialShiftExchange.demand.salience;

        const loss = delta * this.partialShiftExchange.supply.salience;

        const total = Math.abs(this.paretoOptimalExchange.Gain() - loss);

        return [
          [0, utility * multiplier],
          [total * multiplier, utility * multiplier],
          [total * multiplier, 0]
        ];
      }
    }

    const gain = Math.abs(this.paretoOptimalExchange.Loss() + utility);

    const delta = gain / this.partialShiftExchange.demand.salience;

    const loss = delta * this.partialShiftExchange.supply.salience;

    const total = Math.abs(this.paretoOptimalExchange.Gain() - loss);

    return [
      [0, utility * multiplier],
      [total * multiplier, utility * multiplier],
      [total * multiplier, 0]
    ];
  }

  rexJ(multiplier = 1): number[][] {
    const r = this.rValue;
    const eu = this.equalGain();

    let utility;

    if (this.extraGainOrLoss == "gain") {
      utility = eu + r * (this.upperGainJ() - eu);
    } else {
      utility = eu - r * (eu - this.lowerLoss());
    }

    const frontier = this.paretoFrontier();

    const x = frontier[1][0];

    if (frontier.length == 3) {
      if (this.extraGainOrLoss == "gain") {
        if (x > utility) {
          this.swapParetoOptimalIssue();

          const gain = this.paretoOptimalExchange.Loss() + utility;

          const delta = gain / this.partialShiftExchange.demand.salience;

          const loss = delta * this.partialShiftExchange.supply.salience;

          const total = Math.abs(this.paretoOptimalExchange.Gain() - loss);

          return [
            [utility * multiplier, 0],
            [utility * multiplier, total * multiplier],
            [0, total * multiplier]
          ];
        }

        const loss = this.paretoOptimalExchange.Gain() - utility;

        const delta = loss / this.partialShiftExchange.supply.salience;

        const gain = delta * this.partialShiftExchange.demand.salience;

        const total = Math.abs(gain - this.paretoOptimalExchange.Loss());

        return [
          [utility * multiplier, 0],
          [utility * multiplier, total * multiplier],
          [0, total * multiplier]
        ];
      } else {
        if (x > utility) {
          this.swapParetoOptimalIssue();

          const gain = this.paretoOptimalExchange.Loss() + utility;

          const delta = gain / this.partialShiftExchange.demand.salience;

          const loss = delta * this.partialShiftExchange.supply.salience;

          const total = Math.abs(this.paretoOptimalExchange.Gain() - loss);

          return [
            [utility * multiplier, 0],
            [utility * multiplier, total * multiplier],
            [0, total * multiplier]
          ];
        }

        const loss = this.paretoOptimalExchange.Gain() - utility;

        const delta = loss / this.partialShiftExchange.supply.salience;

        const gain = delta * this.partialShiftExchange.demand.salience;

        const total = Math.abs(gain - this.paretoOptimalExchange.Loss());

        return [
          [utility * multiplier, 0],
          [utility * multiplier, total * multiplier],
          [0, total * multiplier]
        ];
      }
    }

    const loss = this.paretoOptimalExchange.Gain() - utility;

    const delta = loss / this.partialShiftExchange.supply.salience;

    const gain = delta * this.partialShiftExchange.demand.salience;

    const total = Math.abs(gain - this.paretoOptimalExchange.Loss());

    return [
      [utility * multiplier, 0],
      [utility * multiplier, total * multiplier],
      [0, total * multiplier]
    ];
  }

  rex(multiplier = 1): number[][] {
    if (this.selectedActor == this.iSupply.demand.actor.name) {
      return this.rexI(multiplier);
    } else {
      return this.rexJ(multiplier);
    }
  }

  randomGain(): number {
    const rex = this.rex();

    let eui;
    let euj;

    if (this.selectedActor == this.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      euj = rex[0][0];
      eui = rex[2][1];
    }

    const exchangeRatioQ = this.paretoOptimalExchange.ExchangeRatioParetoOptimal();

    const exchangeRatioP =
      (euj + exchangeRatioQ * this.paretoOptimalExchange.supply.salience) /
      this.partialShiftExchange.demand.salience;

    let movePartial =
      (exchangeRatioP * this.partialShiftExchange.calcPowerSalience()) /
      this.partialShiftExchange.supply.calcPowerSalience();

    if (movePartial > this.partialShiftExchange.PositionDelta()) {
      // switch supply and demand
      this.swapParetoOptimalIssue();

      const exchangeRatioQ = this.paretoOptimalExchange.ExchangeRatioParetoOptimal();

      const exchangeRatioP =
        (eui + exchangeRatioQ * this.paretoOptimalExchange.supply.salience) /
        this.partialShiftExchange.demand.salience;

      movePartial =
        (exchangeRatioP * this.partialShiftExchange.calcPowerSalience()) /
        this.partialShiftExchange.supply.calcPowerSalience();
    }

    this.paretoOptimalExchange.move = this.paretoOptimalExchange.PositionDelta();
    this.paretoOptimalExchange.applyMove();

    this.partialShiftExchange.move = movePartial;
    this.partialShiftExchange.applyMove();

    return movePartial;
  }

  axisMax(): number {
    return (10 * Math.max(this.euMaxJ, this.euMaxI)) / 9;
  }
}
