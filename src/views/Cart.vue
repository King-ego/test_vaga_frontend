<template>
  <div>
    <div v-if="loading && !products.length">Buscando ...</div>
    <div v-if="!loading && !cart.length && !products.length">Nenhum Produto Encontrado</div>
    <div v-if="!loading && cart.length && !products.length">Carregando ...</div>
    <div v-if="!loading && products.length">
      <div v-for="(product, idx) in products" v-bind:key="product.id">
        <div class="card__img">
          <img :src="product?.image" alt="product"/>
        </div>
        <div>
          <p>{{product.title}}</p>
          <select v-model="product.quantity">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
          </select>
<!--          <p>Quantidade: {{product.quantity}}</p>-->
        </div>
        <button @click="removeProduct(idx)">Remove</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import Product from "../interfaces/Product";

interface Products extends Product {
  quantity: number;
}

export default defineComponent({
  name: "Cart",
  data() {
    return {
      products: [] as Products[],
      loading: false,
      cart: [],
    }
  },
  methods: {
    async getCart() {
      this.loading = true;
      try {
        const id = localStorage.getItem("id");
        const cart = await api.get(`carts/user/${id}`);
        this.cart = cart.data;
        /*const products:Products[] = [];*/
        cart.data[0].products.map(async (product) => {
          const prt = await api.get(`products/${product.productId}`);
          this.products.push({...prt.data, quantity: product.quantity});
        })/*
        this.products = products;*/
      } catch (err) {
        console.log(err)
      }
      this.loading= false;
    },
    removeProduct(position:number){
      console.log(position);
    },
  },
  mounted() {
    this.getCart();
  }
})
</script>

<style scoped>
.card__img {
  width: 100px;
}
.card__img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
