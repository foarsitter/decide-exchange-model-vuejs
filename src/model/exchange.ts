import ActorIssue from "@/model/actorIssue";

export default class Exchange {
  issue: string;
  rabbit: ActorIssue;
  turtle: ActorIssue;

  constructor(issue: string, rabbit: ActorIssue, turtle: ActorIssue) {
    this.issue = issue;
    this.rabbit = rabbit;
    this.turtle = turtle;
  }
}
