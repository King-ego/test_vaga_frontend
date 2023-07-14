<template>
  <div class="product__page">
    <div class="product__boximage">
      <img :src="product?.image" alt="image do produto"/>
    </div>
    <div class="product__info">
      <p class="product__info__title">{{ product?.title }}</p>
      <p class="product__info__title">{{ formatCoinTOBRL(product?.price) }}</p>
      <p class="product__info__title">{{ product?.rating?.rate }}</p>
      <p class="product__info__title">{{ product?.rating?.count }}</p>
      <p class="product__info__title">{{ product?.description }}</p>
      <p class="product__info__title">{{ product?.category }}</p>
    </div>
    <div
        style="background: white; width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px">
      <p>{{ formatCoinTOBRL(product?.price) }}</p>
      <div>
        <label>Quantidade: </label>
        <select v-model="number_product">
          <option selected :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select>
      </div>

      <button @click="setProductInCart">Adicionar ao carrinho</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import Product from "../interfaces/Product";
import formatCoinBRL from "../utils/formatCoinBRL";
import moment from "moment";

export default defineComponent({
  name: "Details",
  data() {
    return {
      product: {} as Product,
      number_product: 1
    }
  },
  methods: {
    async getProduct() {
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
    async setProductInCart() {
      try {
        const cart = await api.post("carts", {
          userId: localStorage.getItem("id"),
          date: moment(moment()).format("YYYY-MM-DD"),
          products: [{productId: this.product.id, quantity: this.number_product}]
        })
      } catch (err) {
        console.log(err)
      }
    }
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
  gap: 20px;
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
  min-height: 40px;
  background: var(--white);
  padding: 10px;
}

.product__info__title:nth-child(2n+1) {
  background: #eaeaea;
}
</style>
