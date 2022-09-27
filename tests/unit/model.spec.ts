import Exchange from "@/model/exchange";
import Actor from "@/model/actor";
import ActorIssue from "@/model/actorIssue";
import Interchange from "@/model/interchange";

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

    expect(p.MDS()).toBeCloseTo(50);
    expect(q.MDS()).toBeCloseTo(8.695);

    const model = new Interchange(p, q);

    expect(model.iSupply.issue).toEqual(model.p.issue);
    expect(model.jSupply.issue).toEqual(model.q.issue);

    expect(model.calcMoveParetoOptimal()).toBeCloseTo(100);
    model.calcMoveByExchangeRatio();

    expect(
      model.partialShiftExchange.ExchangeRatioParetoOptimal()
    ).toBeTruthy();

    expect(model.calcExchangeRatioP()).toBeCloseTo(50);
    expect(model.calcExchangeRatioQ()).toBeCloseTo(45.45);

    model.swapExchanges();
    model.negotiate();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(495.65);
    expect(model.calcExpectedUtilityI()).toBeCloseTo(
      model.calcExpectedUtilityJ()
    );

    expect(model.iSupply).toEqual(model.p);
    expect(model.jSupply).toEqual(model.q);

    expect(model.iDemand).toEqual(model.q);
    expect(model.jDemand).toEqual(model.p);
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

    expect(p.MDS()).toBeCloseTo(85.7142);
    expect(q.MDS()).toBeCloseTo(35.7142);

    const model = new Interchange(p, q);

    expect(model.iSupply.issue).toEqual(model.p.issue);
    expect(model.jSupply).toEqual(model.q);

    expect(model.iDemand).toEqual(model.q);
    expect(model.jDemand).toEqual(model.p);

    // expect(model.calcExchangeRatioP(model.iSupply)).toBeCloseTo(14.285);
    // expect(model.calcExchangeRatioQ(model.jSupply, model.iSupply)).toBeCloseTo(
    //   7.1428
    // );
    //
    // expect(model.calcExpectedUtilityI()).toBeCloseTo(500);
    // expect(model.calcExpectedUtilityJ()).toBeCloseTo(500);
    //
    // expect(model.calcExpectedUtilityI()).toBeCloseTo(
    //   model.calcExpectedUtilityJ()
    // );
    //
    // model.calcSupplyDemandIssue();
    //
    // expect(model.iDelta).toBeCloseTo(14.285);
    // expect(model.jDelta).toBeCloseTo(model.jSupply.mds);
    //
    // expect(model.iLoss).toBeCloseTo(142.857);
    // expect(model.jGain).toBeCloseTo(857.142);
    //
    // expect(model.iGain).toBeCloseTo(3214.285);
    // expect(model.jLoss).toBeCloseTo(1785.714);
    //
    // let max = model.euMaxJ;
    //
    // expect(max["i"]).toBeCloseTo(1400);
    // expect(max["j"]).toBeCloseTo(777.777);
    //
    // // TODO tests are not correct and made afterwards
    // max = model.euMaxI;
    //
    // expect(max["i"]).toBeCloseTo(2916.666);
    // expect(max["j"]).toBeCloseTo(17500.0);
    //
    // const p2 = new Exchange("p", jp, ip);
    // const q2 = new Exchange("q", jq, iq);
    //
    // const model2 = new Interchange(p2, q2);
    // max = model2.euMaxI;
    //
    // expect(max["j"]).toBeCloseTo(1400);
    // expect(max["i"]).toBeCloseTo(777.777);
    //
    // model.rValue = 0.5;
    // model.pValue = 0.75;

    // const x = model.interval();
    // const y = model.interval2();
    // expect(x);
  });
});
