import Exchange from "@/model/exchange";
import Actor from "@/model/actor";
import ActorIssue from "@/model/actorIssue";

export function ExchangeFactory(): Exchange {
  return new Exchange(
    "Finance Who (CoP15)",
    new ActorIssue(new Actor("USA", 1), 80, 50),
    new ActorIssue(new Actor("China", 1), 0, 80)
  );
}

describe("exchange.ts", () => {
  it("isParetoOptimal", () => {
    const e = ExchangeFactory();

    expect(e.isParetoOptimal()).toBeFalsy();

    e.votingPosition = e.demand.position;

    expect(e.isParetoOptimal()).toBeTruthy();
  });
  it("MDS", () => {
    const e = ExchangeFactory();
    expect(e.MDS()).toBeCloseTo(30.77);
  });
  it("calcPowerSalience", () => {
    const e = ExchangeFactory();
    expect(e.calcPowerSalience()).toBeCloseTo(50 + 80);
  });
  it("calcPositionPowerSalience", () => {
    const e = ExchangeFactory();
    expect(e.calcPositionPowerSalience()).toBeCloseTo(50 * 80);
  });
});
