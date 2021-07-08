<template>
  <p>{{ someTitle }}</p>
</template>
<script lang="ts">
import { defineComponent } from "vue"; //eslint-disable-line import/no-unresolved

export default defineComponent({
  data: (): { someTitle: string } => ({
    someTitle: "title",
  }),
});
</script>
