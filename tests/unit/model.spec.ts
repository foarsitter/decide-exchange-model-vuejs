import Exchange from "@/model/exchange";
import Actor from "@/model/actor";
import ActorIssue from "@/model/actorIssue";
import Model from "@/model/model";

describe("exchange.ts", () => {
  it("Calculate the mds", () => {
    const i = new Actor("Actor 1", 70);

    const ip = new ActorIssue(i, 0, 30);
    const iq = new ActorIssue(i, 0, 90);

    const j = new Actor("Actor 2", 30);

    const jp = new ActorIssue(j, 100, 70);
    const jq = new ActorIssue(j, 100, 20);

    const p = new Exchange("Issue 1", ip, jp);
    const q = new Exchange("Issue 2", iq, jq);

    expect(p.calcPowerSalience()).toBeCloseTo(4200);
    expect(q.calcPowerSalience()).toBeCloseTo(6900);

    expect(p.calcPositionPowerSalience()).toBeCloseTo(210_000);
    expect(q.calcPositionPowerSalience()).toBeCloseTo(60_000);

    expect(p.mds).toBeCloseTo(50);
    expect(q.mds).toBeCloseTo(8.695);

    const model = new Model(p, q);

    expect(model.iSupply.issue).toEqual(model.p.issue);
    expect(model.jSupply.issue).toEqual(model.q.issue);

    expect(model.calcExchangeRatioP(model.iSupply)).toBeCloseTo(50);
    expect(model.calcExchangeRatioQ(model.jSupply, model.iSupply)).toBeCloseTo(
      45.45
    );

    expect(model.calcExpectedUtilityI()).toBeCloseTo(2590.909);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(2590.909);

    expect(model.calcExpectedUtilityI()).toEqual(model.calcExpectedUtilityJ());

    //    demand and supply issue

    // model.calcSupplyDemandIssue();

    expect(model.iSupply.issue).toEqual(model.p.issue);
    expect(model.jSupply).toEqual(model.q);

    expect(model.iDemand).toEqual(model.q);
    expect(model.jDemand).toEqual(model.p);

    expect(model.iDelta).toBeCloseTo(model.p.mds);
    expect(model.jDelta).toBeCloseTo(model.q.mds);

    expect(model.iLoss).toBeCloseTo(1500);
    expect(model.jGain).toBeCloseTo(3500);

    expect(model.iGain).toBeCloseTo(782.608);
    expect(model.jLoss).toBeCloseTo(173.913);

    expect(model.calcMoveJ(model.iSupply)).toBeCloseTo(100);
    expect(model.calcMoveI(model.jSupply)).toBeCloseTo(522.7272);

    const maxInterval = Math.abs(
      model.iSupply.demand.position - model.iSupply.supply.position
    );

    if (model.jSupply.move > maxInterval) {
      expect(model.calcExchangeRatioP(model.jSupply)).toBeCloseTo(8.695);
      expect(
        model.calcExchangeRatioQ(model.iSupply, model.jSupply)
      ).toBeCloseTo(9.565);
    }

    expect(model.calcMoveJ(model.jSupply)).toBeCloseTo(100);
    expect(model.calcMoveI(model.iSupply)).toBeCloseTo(19.13);

    // const s =
    //   model.jSupply.j.salience /
    //   (model.jSupply.i.salience + model.jSupply.j.salience);

    // expect(s).toBeCloseTo(0.1818)
    //
    // let delta_1 =  model.iLoss / (model.jSupply.i.salience * s)
    // let delta_2 = model.jGain / (model.jSupply.j.salience * s)
    //
    // expect(delta_1).toBeCloseTo(4.4444)
    // expect(delta_2).toBeCloseTo(48)
    //
    // let eu_max_i = model.jSupply.i.salience * s * delta_2 - model.iLoss
    // let eu_max_j = model.jGain - model.jSupply.j.salience * s * delta_1
    //
    // expect(eu_max_i).toBeCloseTo(1400)
    // expect(eu_max_j).toBeCloseTo(777.777)
  });
  it("Calculate the mds again", () => {
    const i = new Actor("i", 50);
    const j = new Actor("j", 50);

    const ip = new ActorIssue(i, 0, 10);
    const jp = new ActorIssue(j, 100, 60);

    const iq = new ActorIssue(i, 0, 90);
    const jq = new ActorIssue(j, 100, 50);

    const p = new Exchange("p", ip, jp);
    const q = new Exchange("q", iq, jq);

    expect(p.calcPowerSalience()).toBeCloseTo(3500);
    expect(q.calcPowerSalience()).toBeCloseTo(7000);

    expect(p.calcPositionPowerSalience()).toBeCloseTo(300000);
    expect(q.calcPositionPowerSalience()).toBeCloseTo(250000);

    expect(p.mds).toBeCloseTo(85.7142);
    expect(q.mds).toBeCloseTo(35.7142);

    const model = new Model(p, q);

    expect(model.iSupply.issue).toEqual(model.p.issue);
    expect(model.jSupply).toEqual(model.q);

    expect(model.iDemand).toEqual(model.q);
    expect(model.jDemand).toEqual(model.p);

    expect(model.calcExchangeRatioP(model.iSupply)).toBeCloseTo(14.285);
    expect(model.calcExchangeRatioQ(model.jSupply, model.iSupply)).toBeCloseTo(
      7.1428
    );

    expect(model.calcExpectedUtilityI()).toBeCloseTo(500);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(500);

    expect(model.calcExpectedUtilityI()).toBeCloseTo(
      model.calcExpectedUtilityJ()
    );

    model.calcSupplyDemandIssue();

    expect(model.iDelta).toBeCloseTo(14.285);
    expect(model.jDelta).toBeCloseTo(model.jSupply.mds);

    expect(model.iLoss).toBeCloseTo(142.857);
    expect(model.jGain).toBeCloseTo(857.142);

    expect(model.iGain).toBeCloseTo(3214.285);
    expect(model.jLoss).toBeCloseTo(1785.714);

    let max = model.euMaxJ;

    expect(max["i"]).toBeCloseTo(1400);
    expect(max["j"]).toBeCloseTo(777.777);

    // TODO tests are not correct and made afterwards
    max = model.euMaxI;

    expect(max["i"]).toBeCloseTo(2916.666);
    expect(max["j"]).toBeCloseTo(17500.0);

    const p2 = new Exchange("p", jp, ip);
    const q2 = new Exchange("q", jq, iq);

    const model2 = new Model(p2, q2);
    max = model2.euMaxI;

    expect(max["j"]).toBeCloseTo(1400);
    expect(max["i"]).toBeCloseTo(777.777);

    model.rValue = 0.5;
    model.pValue = 0.75;

    // const x = model.interval();
    // const y = model.interval2();
    // expect(x);
  });
});
