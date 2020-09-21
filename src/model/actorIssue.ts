import Actor from "@/model/actor";

export default class ActorIssue {
  salience: number;
  position: number;
  actor: Actor;

  constructor(salience: number, position: number, actor: Actor) {
    this.salience = salience;
    this.position = position;
    this.actor = actor;
  }
}
