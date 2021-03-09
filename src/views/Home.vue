<template>
  <div class="container is-fluid">
    <p>
      url:
      <a :href="href()"
        >https://decide-exchange-model.netlify.app/#/model/{{ url }}
      </a>
    </p>
    <ConfigTable v-bind:model="model"></ConfigTable>
    <Power v-bind:rabbit="i" v-bind:turtle="j"></Power>
    <Exchange
      v-bind:exchange="p"
      v-bind:mds-voting="mdsPVoting"
      v-bind:mds-random="mdsRandomP"
      v-bind:voting-position="votingPositionP"
      v-bind:voting-random="votingRandomP"
      v-bind:move="moveP"
      v-bind:move-random="moveRandomP"
      v-bind:exchange-ratio="exchangeRatioP"
      v-bind:exchange-ratio-random="exchangeRatioRandomP"
    >
      <template #title>{{ p.issue }}</template>
    </Exchange>
    <Exchange
      v-bind:exchange="q"
      v-bind:mds-voting="mdsQVoting"
      v-bind:mds-random="mdsRandomQ"
      v-bind:voting-position="votingPositionQ"
      v-bind:voting-random="votingRandomQ"
      v-bind:move="moveQ"
      v-bind:move-random="moveRandomQ"
      v-bind:exchange-ratio="exchangeRatioQ"
      v-bind:exchange-ratio-random="exchangeRatioRandomQ"
    >
      <template #title>{{ q.issue }}</template>
    </Exchange>

    <ResultsComponent
      v-bind:model="model"
      v-bind:eui="eui"
      v-bind:euj="euj"
      v-bind:exchangeRatioQ="exchangeRatioQ"
      v-bind:exchangeRatioP="exchangeRatioP"
      v-bind:equal-gain="equalGain"
      v-bind:eu-max-i="euMaxI"
      v-bind:eu-max-j="euMaxJ"
      v-bind:supply-loss-i="supplyLossI"
      v-bind:supply-loss-j="supplyLossJ"
      v-bind:demand-gain-i="demandGainI"
      v-bind:demand-gain-j="demandGainJ"
      v-bind:pareto-frontier="paretoFrontier"
    ></ResultsComponent>

    <REXComponent v-bind:model="model"></REXComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PowerComponent from "@/components/PowerComponent.vue";
import ConfigTable from "@/components/ConfigTable.vue";
import ExchangeComponent from "@/components/IssueComponent.vue";
import Actor from "@/model/actor";
import Exchange from "@/model/exchange";
import ActorIssue from "@/model/actorIssue";
import Interchange from "@/model/interchange";
import VueApexCharts from "vue-apexcharts";
import ResultsComponent from "@/components/ResultsComponent.vue";
import REXComponent from "@/components/REXComponent.vue";

@Component({
  components: {
    ConfigTable,
    REXComponent,
    ResultsComponent,
    Exchange: ExchangeComponent,
    Power: PowerComponent,
    apexchart: VueApexCharts
  }
})
export default class Home extends Vue {
  dirty = false;

  // i in the excel sheet
  i = new Actor("China", 0.85);
  j = new Actor("USA", 1);

  p = new Exchange(
    "Fin Vol",
    new ActorIssue(this.i, 100, 0.5),
    new ActorIssue(this.j, 0, 0.3)
  );

  q = new Exchange(
    "Fin Who",
    new ActorIssue(this.i, 0, 0.8),
    new ActorIssue(this.j, 80, 0.5)
  );
  model = new Interchange(this.p, this.q);

  splitChar = ";";

  eui = 0;
  euj = 0;

  equalGain = 0;

  exchangeRatioP = 0;
  exchangeRatioQ = 0;

  euMaxI = 0;
  euMaxJ = 0;

  supplyLossI = 0;
  supplyLossJ = 0;

  demandGainI = 0;
  demandGainJ = 0;

  paretoFrontier = [
    [0, 0],
    [0, 0]
  ];

  mdsPVoting = 0;
  mdsQVoting = 0;

  votingPositionP = 0;
  votingPositionQ = 0;

  moveP = 0;
  moveQ = 0;

  rexExpectedUtilityI = 0;
  rexExpectedUtilityJ = 0;
  // actors
  moveRandomP = 0;
  moveRandomQ = 0;

  votingRandomP = 0;
  votingRandomQ = 0;

  mdsRandomP = 0;
  mdsRandomQ = 0;

  exchangeRatioRandomP = 0;
  exchangeRatioRandomQ = 0;

  url = "";

  @Watch("p.issue")
  @Watch("q.issue")
  @Watch("i.name")
  @Watch("j.name")
  @Watch("i.power")
  @Watch("j.power")
  // issue p
  @Watch("p.i.salience")
  @Watch("p.j.salience")
  @Watch("p.i.position")
  @Watch("p.j.position")
  // issue q
  @Watch("q.i.salience")
  @Watch("q.j.salience")
  @Watch("q.i.position")
  @Watch("q.j.position")
  // model values
  @Watch("model.pValue")
  @Watch("model.rValue")
  @Watch("model.selectedActor")
  @Watch("model.extraGainOrLoss")
  dinerChanged() {
    if (!this.dirty) {
      this.dirty = true;
      this.update(true);
      this.dirty = false;
    }
  }

  href() {
    return "https://decide-exchange-model.netlify.app/#/model/" + this.url;
  }

  update(redirect: boolean) {
    if (redirect) {
      const objects = [];
      objects.push("v1");
      objects.push(this.model.iSupply.supply.actor.name);
      objects.push(this.model.jSupply.supply.actor.name);
      objects.push(this.model.iSupply.supply.exchange?.issue);
      objects.push(this.model.jSupply.supply.exchange?.issue);
      objects.push(this.model.iSupply.supply.actor.power);
      objects.push(this.model.jSupply.supply.actor.power);

      objects.push(this.model.iSupply.supply.salience);
      objects.push(this.model.iSupply.supply.position);

      objects.push(this.model.iSupply.demand.salience);
      objects.push(this.model.iSupply.demand.position);

      objects.push(this.model.jSupply.supply.salience);
      objects.push(this.model.jSupply.supply.position);

      objects.push(this.model.jSupply.demand.salience);
      objects.push(this.model.jSupply.demand.position);

      objects.push(this.model.rValue);
      objects.push(this.model.pValue);

      objects.push(this.model.selectedActor);
      objects.push(this.model.extraGainOrLoss);

      const compressed = objects.join(this.splitChar);

      if (this.$route.params["q"] != compressed) {
        this.url = compressed;
        this.$router.push({ name: "Home", params: { q: compressed } });
      }
    }
    this.equalGain = this.model.equalGain();

    if (this.equalGain < 0) {
      console.log("Gain cannot be lower then 0");
    }

    // this.eui = this.model.calcExpectedUtilityI();
    // this.euj = this.model.calcExpectedUtilityJ();

    this.mdsPVoting = this.model.p.MDSVoting();
    this.mdsQVoting = this.model.q.MDSVoting();

    this.votingPositionP = this.model.p.votingPosition;
    this.votingPositionQ = this.model.q.votingPosition;

    this.moveP = this.p.move;
    this.moveQ = this.q.move;

    this.exchangeRatioP = this.model.calcExchangeRatioP();
    this.exchangeRatioQ = this.model.calcExchangeRatioQ();

    this.supplyLossI = this.model.iSupply.Loss();
    this.supplyLossJ = this.model.jSupply.Loss();

    this.demandGainI = this.model.iDemand.Gain();
    this.demandGainJ = this.model.jDemand.Gain();

    this.euMaxI = this.model.euMaxI;
    this.euMaxJ = this.model.euMaxJ;

    this.paretoFrontier = this.model.paretoFrontier();

    const rex = this.model.rex();

    if (this.model.selectedActor == this.model.iSupply.demand.actor.name) {
      this.eui = rex[2][0];
      this.euj = rex[0][1];
    } else {
      this.eui = rex[0][0];
      this.euj = rex[2][1];
    }

    this.model.randomGain();

    this.moveRandomP = this.p.move;
    this.moveRandomQ = this.q.move;

    this.votingRandomP = this.p.votingPosition;
    this.votingRandomQ = this.q.votingPosition;

    this.exchangeRatioRandomP = this.model.calcExchangeRatioP();
    this.exchangeRatioRandomQ = this.model.calcExchangeRatioQ();

    this.mdsRandomP = this.model.p.MDSVoting();
    this.mdsRandomQ = this.model.q.MDSVoting();
  }

  mounted() {
    const str = this.$route.params["q"];

    if (str) {
      this.dirty = true;
      const items = str?.split(this.splitChar);
      let i = 1;
      this.model.iSupply.supply.actor.name = items[i++];
      this.model.jSupply.supply.actor.name = items[i++];
      if (this.model.iSupply.supply.exchange !== undefined) {
        this.model.iSupply.supply.exchange.issue = items[i++];
      }

      if (this.model.jSupply.supply.exchange !== undefined) {
        this.model.jSupply.supply.exchange.issue = items[i++];
      }
      this.model.iSupply.supply.actor.power = parseFloat(items[i++]);
      this.model.jSupply.supply.actor.power = parseFloat(items[i++]);

      this.model.iSupply.supply.salience = parseFloat(items[i++]);
      this.model.iSupply.supply.position = parseFloat(items[i++]);

      this.model.iSupply.demand.salience = parseFloat(items[i++]);
      this.model.iSupply.demand.position = parseFloat(items[i++]);

      this.model.jSupply.supply.salience = parseFloat(items[i++]);
      this.model.jSupply.supply.position = parseFloat(items[i++]);

      this.model.jSupply.demand.salience = parseFloat(items[i++]);
      this.model.jSupply.demand.position = parseFloat(items[i++]);

      this.model.rValue = parseFloat(items[i++]);
      this.model.pValue = parseFloat(items[i++]);

      this.model.selectedActor = items[i++];
      this.model.extraGainOrLoss = items[i++];
      this.dirty = false;
    }
    this.update(false);
  }
}
</script>
