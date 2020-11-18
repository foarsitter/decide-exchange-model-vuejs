import Actor from "@/model/actor";
import Exchange from "@/model/exchange";

export default class ActorIssue {
  salience: number;
  position: number;
  actor: Actor;
  public exchange: Exchange | undefined;

  constructor(actor: Actor, position: number, salience: number) {
    this.actor = actor;
    this.position = position;
    this.salience = salience;
  }

  calcPowerSalience() {
    return this.salience * this.actor.power;
  }

  calcPositionPowerSalience() {
    return this.calcPowerSalience() * this.position;
  }
}
