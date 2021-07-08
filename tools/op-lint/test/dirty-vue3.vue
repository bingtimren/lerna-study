<template>
  <p>{{someTitle}}</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["someTitle"],
  data: (): any => ({
    someTitle: "title",
  }),
  watch: {
    someTitle: ()=>{}
  }
});
</script>
