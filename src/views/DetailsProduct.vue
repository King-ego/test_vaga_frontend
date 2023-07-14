<template>
<div class="product__page">
  <div class="product__boximage">
    <img :src="product?.image" alt="image do produto"/>
  </div>
  <div class="product__info">
    <p class="product__info__title">{{product?.title}}</p>
    <p class="product__info__title">{{formatCoinTOBRL(product?.price)}}</p>
    <p class="product__info__title">{{product?.rating?.rate}}</p>
    <p class="product__info__title">{{product?.rating?.count}}</p>
    <p class="product__info__title">{{product?.description}}</p>
    <p class="product__info__title">{{product?.category}}</p>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import Product from "../interfaces/Product";
import formatCoinBRL from "../utils/formatCoinBRL";

export default defineComponent({
  name: "Details",
  data(){
    return {
      product: {} as Product,
    }
  },
  methods: {
    async getProduct(){
      try {
        const id = this.$route.params.id;
        const product = await api.get(`products/${id}`);
        this.product = product.data;
      } catch (e) {
        console.log(e);
      }
    },
    formatCoinTOBRL(coin: number) {
      return formatCoinBRL(coin);
    },
  },
  mounted() {
    this.getProduct();
  }
})
</script>

<style scoped>
.product__page {
  display: flex;
  flex-wrap: wrap;
}
.product__boximage {
  width: 300px;
  padding: 20px;
  background: var(--white);
  border-radius: 10px;
}

.product__boximage img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product__info {
  width: 100%;
  max-width: 500px;
}

.product__info__title {
  border-bottom: 1px solid var(--gray-three);
  border-left: 1px solid var(--gray-three);
  min-height: 40px;
  background: var(--white);
}
.product__info__title:nth-child(2n+1) {
  background: #eaeaea;
}
</style>
