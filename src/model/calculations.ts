import Exchange from "@/model/exchange";

export function positionForZero(supply: Exchange, demand: Exchange): number {
  const delta = demand.Gain() / supply.supply.salience;
  const mds = supply.MDS() - delta;
  return (
    (mds * supply.calcPowerSalience() - supply.demand.calcPowerSalience()) /
    supply.supply.calcPowerSalience()
  );
}

export function maxExpectedUtility(supply: Exchange, demand: Exchange): number {
  const p = positionForZero(supply, demand);

  const supplyGain = supply.Gain();
  const supplyLoss = supply.Loss();

  const demandGain = demand.Gain();
  const demandLoss = demand.Loss();

  const supplyUtility = supplyGain - supplyLoss;
  const demandUtility = demandGain - demandLoss;

  let overwrite = 0;

  const s =
    demand.supply.salience / (demand.supply.salience + demand.demand.salience);

  if (supply.isParetoOptimal()) {
    if (supplyUtility > 0) {
      overwrite =
        supplyGain -
        (supplyLoss / demand.demand.salience) * demand.supply.salience;
    }
  } else {
    if (demandUtility > 0) {
      overwrite =
        demandGain -
        (demandLoss / supply.demand.salience) * supply.supply.salience;
    }
  }

  const delta1 = supplyLoss / (demand.demand.salience * s);

  const supplyUtilityX = supplyGain - supply.supply.salience * s * delta1;

  return overwrite;
}

export function exchangeRatioParetoOptimal(exchange: Exchange): number {
  return (
    (Math.abs(exchange.supply.position - exchange.demand.position) *
      exchange.supply.calcPowerSalience()) /
    exchange.calcPowerSalience()
  );
}
