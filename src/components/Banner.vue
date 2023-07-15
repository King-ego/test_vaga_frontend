<template>
  <div>
    <div class="banner">
      <p class="banner__title">
        Em Breve novas ofertas
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Banner"
})
</script>

<style scoped>
.banner {
  background: var(--green-sea-light);
  height: 200px;
  border-radius: 20px;
  margin: 20px 10px;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.banner::before {
  content: "";
  position: absolute;
  left: 10%;
  top: 40%;
  right: 10%;
  bottom: 40%;
  background: var(--indigo);
}

.banner::after {
  content: "";
  position: absolute;
  left: 10%;
  top: 50%;
  right: 60%;
  bottom: 40%;
  background: var(--yellow-light);
}

.banner__title {
  padding-left: 20px;
  padding-bottom: 20px;
  font-family: "Montserrat";
  font-weight: 500;
  color: var(--blue-black);
  font-size: 22px;
}
</style>
