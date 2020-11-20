import Interchange from "@/model/interchange";
import Actor from "@/model/actor";
import ActorIssue from "@/model/actorIssue";
import Exchange from "@/model/exchange";

function InterchangeFactory(): Interchange {
  // i in the excel sheet
  const i = new Actor("China", 1);
  const j = new Actor("USA", 1);

  const p = new Exchange(
    "fin vol",
    new ActorIssue(i, 100, 50),
    new ActorIssue(j, 0, 70)
  );

  const q = new Exchange(
    "fin who",
    new ActorIssue(i, 0, 80),
    new ActorIssue(j, 80, 50)
  );

  return new Interchange(p, q);
}

describe("interchange.ts", () => {
  it("check the initial positions in terms of demand and supply", () => {
    const model = InterchangeFactory();

    expect(model.iSupply.supply.actor.name).toBe("China");
    expect(model.jSupply.supply.actor.name).toBe("USA");

    expect(model.iSupply.issue).toBe("fin vol");
    expect(model.jSupply.issue).toBe("fin who");

    expect(model.iSupply.supply.position).toBe(100);
    expect(model.iSupply.demand.position).toBe(0);

    expect(model.jSupply.supply.position).toBe(80);
    expect(model.jSupply.demand.position).toBe(0);

    expect(model.paretoOptimalExchange.issue).toBe("fin vol");
    expect(model.partialShiftExchange.issue).toBe("fin who");
  });

  it("exchange ratio", () => {
    const model = InterchangeFactory();

    expect(model.calcExchangeRatioP()).toBeCloseTo(41.667);
    expect(model.calcExchangeRatioQ()).toBeCloseTo(38.46);

    model.swapParetoOptimalIssue();

    expect(model.calcExchangeRatioP()).toBeCloseTo(30.77);
    expect(model.calcExchangeRatioQ()).toBeCloseTo(33.33);
  });

  it("expected utility", () => {
    const model = InterchangeFactory();

    model.dance();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(993.589743589743);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(993.589743589743);

    expect(model.partialShiftExchange.MoveExceedsDelta()).toBeTruthy();

    model.swapParetoOptimalIssue();
    model.dance();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(794.871794871794);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(794.871794871794);
  });

  it("expected utility through update method", () => {
    const model = InterchangeFactory();

    model.negotiate();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(794.871794871794);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(794.871794871794);
    expect(model.equalGain()).toBeCloseTo(794.871794871794);

    expect(model.paretoOptimalExchange.move).toBe(80);
  });
  it("maximum expected utlity", () => {
    const model = InterchangeFactory();

    model.iSupply.votingPosition = model.iSupply.demand.position;
    model.jSupply.votingPosition = model.jSupply.demand.position;

    expect(model.euMaxJ).toBeCloseTo(1362.63736263736);
    expect(model.euMaxI).toBeCloseTo(1614.58);
  });
  it("pareto frontier", () => {
    const model = InterchangeFactory();

    const x = model.paretoFrontier();

    expect(x[0]).toBeCloseTo(378.21);
    expect(x[1]).toBeCloseTo(1378.21);
  });

  it("USA new expected utilty (p=0.9, r=1)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.xyz();

    expect(x[1][0]).toBeCloseTo(131.15);
    expect(x[1][1]).toBeCloseTo(1532.61);
  });

  it("USA new expected utilty (p=0.9, r=0.5)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 0.5;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.xyz();

    expect(x[1][0]).toBeCloseTo(531.39);
    expect(x[1][1]).toBeCloseTo(1163.74);
  });

  it("China new expected utilty (p=0.9, r=1)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "China";
    model.extraGainOrLoss = "gain";

    const x = model.xyz();

    expect(x[1][0]).toBeCloseTo(1305.8608058608);
    expect(x[1][1]).toBeCloseTo(79.49);
  });
});
