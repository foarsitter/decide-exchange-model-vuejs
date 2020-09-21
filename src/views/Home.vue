<template>
  <div class="container">
    <Power v-bind:rabbit="rabbit" v-bind:turtle="turtle"></Power>
    <Exchange v-bind:exchange="holiday"
      ><template #title>{{ holiday.issue }}</template></Exchange
    >
    <Exchange v-bind:exchange="diner"
      ><template #title>{{ diner.issue }}</template></Exchange
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PowerComponent from "@/components/PowerComponent.vue";
import ExchangeComponent from "@/components/IssueComponent.vue";
import Actor from "@/model/actor";
import Exchange from "@/model/exchange";
import ActorIssue from "@/model/actorIssue";

@Component({
  components: {
    Exchange: ExchangeComponent,
    Power: PowerComponent
  }
})
export default class Home extends Vue {
  rabbit = new Actor("🐰", 0.4);
  turtle = new Actor("🐢", 0.6);

  holiday = new Exchange(
    "Holiday",
    new ActorIssue(0.5, 75, this.rabbit),
    new ActorIssue(0.5, 25, this.turtle)
  );

  diner = new Exchange(
    "Diner",
    new ActorIssue(0.5, 25, this.rabbit),
    new ActorIssue(0.5, 75, this.turtle)
  );
}
</script>
