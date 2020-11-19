import Exchange from "@/model/exchange";

export function maxExpectedUtility(supply: Exchange, demand: Exchange): number {
  const gain = supply.Gain();
  const loss = supply.Loss();

  const s =
    demand.supply.salience / (demand.supply.salience + demand.demand.salience);

  const delta1 = loss / (demand.demand.salience * s);

  // const delta2 = gain / (s * supply.supply.salience);

  // const x = s * demand.demand.salience * delta2 - loss;

  return gain - supply.supply.salience * s * delta1;
}

export function exchangeRatioParetoOptimal(exchange: Exchange): number {
  return (
    (Math.abs(exchange.supply.position - exchange.demand.position) *
      exchange.supply.calcPowerSalience()) /
    exchange.calcPowerSalience()
  );
}