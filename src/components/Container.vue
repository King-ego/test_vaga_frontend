<template>
  <div class="container">
    <slot/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Container"
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1600px;
  margin: auto;
}
</style>
