import Interchange from "@/model/interchange";
import Actor from "@/model/actor";
import ActorIssue from "@/model/actorIssue";
import Exchange from "@/model/exchange";

function InterchangeFactory(): Interchange {
  // i in the excel sheet
  const china = new Actor("China", 1);
  const usa = new Actor("USA", 1);

  const p = new Exchange(
    "fin vol",
    new ActorIssue(china, 100, 0.5),
    new ActorIssue(usa, 0, 0.7)
  );

  const q = new Exchange(
    "fin who",
    new ActorIssue(china, 0, 0.8),
    new ActorIssue(usa, 80, 0.5)
  );

  return new Interchange(p, q);
}

function InterchangeFactoryInverted(): Interchange {
  // i in the excel sheet
  const china = new Actor("China", 1);
  const usa = new Actor("USA", 1);

  const q = new Exchange(
    "fin vol",
    new ActorIssue(usa, 0, 70),
    new ActorIssue(china, 100, 50)
  );

  const p = new Exchange(
    "fin who",
    new ActorIssue(usa, 80, 50),
    new ActorIssue(china, 0, 80)
  );

  return new Interchange(p, q);
}

function InterchangeFactory2(): Interchange {
  // i in the excel sheet
  const brazil = new Actor("Brazil", 0.5);
  const usa = new Actor("USA", 0.5);

  const p = new Exchange(
    "LD",
    new ActorIssue(brazil, 0, 10),
    new ActorIssue(usa, 100, 60)
  );

  const q = new Exchange(
    "fin who",
    new ActorIssue(brazil, 0, 90),
    new ActorIssue(usa, 100, 50)
  );

  return new Interchange(p, q);
}

function InterchangeFactoryBelowZero(): Interchange {
  // i in the excel sheet
  const china = new Actor("China", 0.85);
  const usa = new Actor("USA", 1.0);

  const p = new Exchange(
    "Fin Vol",
    new ActorIssue(china, 100, 0.5),
    new ActorIssue(usa, 0, 0.35)
  );

  const q = new Exchange(
    "Fin Who",
    new ActorIssue(china, 0, 0.8),
    new ActorIssue(usa, 80, 0.5)
  );

  return new Interchange(p, q);
}

function ChinaUsaFinVolEAA(power = 1): Interchange {
  // i in the excel sheet
  const china = new Actor("China", power);
  const usa = new Actor("USA", 1);

  const p = new Exchange(
    "Fin Vol",
    new ActorIssue(china, 100, 0.5),
    new ActorIssue(usa, 0, 0.7)
  );

  const q = new Exchange(
    "EAA",
    new ActorIssue(china, 0, 0.65),
    new ActorIssue(usa, 100, 0.4)
  );

  return new Interchange(p, q);
}

function BrazilUSAFinWhoFinVol(): Interchange {
  const brazil = new Actor("Brazil", 0.7);
  const usa = new Actor("USA", 1);

  const finVol = new Exchange(
    "Fin Vol",
    new ActorIssue(brazil, 50, 0.55),
    new ActorIssue(usa, 0, 0.9)
  );

  const finWho = new Exchange(
    "Fin Who",
    new ActorIssue(brazil, 0, 0.7),
    new ActorIssue(usa, 80, 0.5)
  );
  return new Interchange(finWho, finVol);
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

    expect(model.calcExpectedUtilityI()).toBeCloseTo(9.93589743589743);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(9.93589743589743);

    expect(model.partialShiftExchange.MoveExceedsDelta()).toBeTruthy();

    model.swapParetoOptimalIssue();
    model.dance();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(7.94871794871794);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(7.94871794871794);
  });

  it("expected utility through update method", () => {
    const model = InterchangeFactory();

    model.negotiate();

    expect(model.calcExpectedUtilityI()).toBeCloseTo(7.94871794871794);
    expect(model.calcExpectedUtilityJ()).toBeCloseTo(7.94871794871794);
    expect(model.equalGain()).toBeCloseTo(7.94871794871794);

    expect(model.paretoOptimalExchange.move).toBe(80);
  });
  it("maximum expected utlity", () => {
    const model = InterchangeFactory();

    // model.iSupply.votingPosition = model.iSupply.demand.position;
    // model.jSupply.votingPosition = model.jSupply.demand.position;

    expect(model.euMaxI).toBeCloseTo(16.1458);
    expect(model.euMaxJ).toBeCloseTo(13.6263736263736);
  });
  it("pareto frontier", () => {
    const model = InterchangeFactory();

    const x = model.paretoFrontier()[1];

    expect(x[0]).toBeCloseTo(3.7821);
    expect(x[1]).toBeCloseTo(13.7821);
  });

  it("USA new expected utilty (p=0.9, r=1)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.rex();

    expect(x[1][1]).toBeCloseTo(15.3261);
    expect(x[1][0]).toBeCloseTo(1.3115);
  });

  it("Extra gain for USA (p=0.9, r=0.5)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 0.5;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.rex();

    expect(x[1][0]).toBeCloseTo(5.3139);
    expect(x[1][1]).toBeCloseTo(11.6374);
  });

  it("Extra loss for China (p=0.9, r=0.5)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 0.5;
    model.selectedActor = "China";
    model.extraGainOrLoss = "loss";

    const x = model.rex();

    expect(x[1][0]).toBeCloseTo(4.37179);
    expect(x[1][1]).toBeCloseTo(12.96);
  });

  it("China extra expected utilty (p=0.9, r=1)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "China";
    model.extraGainOrLoss = "gain";

    const x = model.rex();

    expect(x[1][0]).toBeCloseTo(13.058608058608);
    expect(x[1][1]).toBeCloseTo(0.7949);
  });

  it("China less expected utilty (p=0.9, r=1)", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "China";
    model.extraGainOrLoss = "loss";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(eui).toBeCloseTo(0.7949);
    expect(euj).toBeCloseTo(15.65);
  });
  it("New exchange", () => {
    const model = InterchangeFactory();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.randomGain();

    expect(x).toBeCloseTo(57.24);

    expect(model.partialShiftExchange.MDSVoting()).toBeCloseTo(17.82);
  });

  it("Maximal utility 2", () => {
    const model = InterchangeFactory2();
    model.equalGain();

    expect(model.zeroUtilityI()).toBeCloseTo(1400);
    expect(model.zeroUtilityJ()).toBeCloseTo(777.7777);

    expect(model.zeroUtilityIPosition()).toBeCloseTo(50.2);
    expect(model.zeroUtilityJPosition()).toBeCloseTo(93.7555555555555);
  });

  it("Maximal utility 2 for x", () => {
    const model = InterchangeFactory2();

    model.pValue = 0.9;
    model.rValue = 1;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const x = model.rex();

    const utilityI = x[0][1];
    const utilityJ = x[2][0];

    expect(utilityI).toBeCloseTo(1310);
    expect(utilityJ).toBeCloseTo(50);
  });

  it("Maximal utility", () => {
    const model = InterchangeFactory();
    model.equalGain();

    expect(model.zeroUtilityI()).toBeCloseTo(19.0769);

    expect(model.euMaxI).toBeCloseTo(16.145833333);
    expect(model.zeroUtilityJ()).toBeCloseTo(13.6263736263736);
    expect(model.zeroUtilityJ()).toBeCloseTo(model.euMaxJ);
  });

  it("Maximal utility inverted", () => {
    const model = InterchangeFactoryInverted();
    model.equalGain();

    expect(model.zeroUtilityI()).toBeCloseTo(1907.69);
    expect(model.zeroUtilityIPosition()).toBeCloseTo(-19.5538461538462);
    expect(model.zeroUtilityJ()).toBeCloseTo(1362.64);
  });

  it("Should not have a equal gain lower then zero", () => {
    const model = InterchangeFactoryBelowZero();

    const equalGain = model.equalGain();

    expect(equalGain).toBeGreaterThan(0);
  });

  it("Check maximum utility for USA", () => {
    const model = ChinaUsaFinVolEAA();
    model.equalGain();
    model.randomGain();

    expect(model.euMaxI).toBeCloseTo(16.3461538461538);
    expect(model.euMaxJ).toBeCloseTo(13.875510204082);
  });

  it("Validate exchange", () => {
    const model = BrazilUSAFinWhoFinVol();
    model.pValue = 0.9;
    model.rValue = 0.5;
    model.selectedActor = "Brazil";
    model.extraGainOrLoss = "less";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }
    expect(eui).toBeCloseTo(2.44);
    expect(euj).toBeCloseTo(7.22);
  });
  it("Offset equals equal gain", () => {
    const model = ChinaUsaFinVolEAA(0.8);
    model.pValue = 1;
    model.rValue = 0.5;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "gain";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(eui).toBeCloseTo(4.42);
    expect(euj).toBeCloseTo(11.55);
  });
  it("Offset equals equal gain 2", () => {
    const model = ChinaUsaFinVolEAA(1);
    model.pValue = 1;
    model.rValue = 0.5;
    model.selectedActor = "USA";
    model.extraGainOrLoss = "less";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(euj).toBeCloseTo(4.05);
    expect(eui).toBeCloseTo(10.99);
  });
  it("Offset equals equal gain 3", () => {
    const model = ChinaUsaFinVolEAA(1);
    model.pValue = 1;
    model.rValue = 0.5;
    model.selectedActor = "China";
    model.extraGainOrLoss = "less";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(euj).toBeCloseTo(13.76);
    expect(eui).toBeCloseTo(4.05);
  });
  it("Offset equals equal gain 4", () => {
    const model = ChinaUsaFinVolEAA(1);
    model.pValue = 1;
    model.rValue = 0.85;
    model.selectedActor = "China";
    model.extraGainOrLoss = "less";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(euj).toBeCloseTo(15.6);
    expect(eui).toBeCloseTo(1.21);
  });
  it("Offset equals equal gain 5", () => {
    const model = ChinaUsaFinVolEAA(0.8);
    model.pValue = 1;
    model.rValue = 0.8;
    model.selectedActor = "China";
    model.extraGainOrLoss = "loss";

    const rex = model.rex();

    let eui, euj;

    if (model.selectedActor == model.iSupply.demand.actor.name) {
      eui = rex[2][0];
      euj = rex[0][1];
    } else {
      eui = rex[0][0];
      euj = rex[2][1];
    }

    expect(euj).toBeCloseTo(13.18);
    expect(eui).toBeCloseTo(1.77);
  });
});
