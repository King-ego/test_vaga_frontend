<template>
  <div>
    <Header @search="filter"/>
<!--    <div>
      <p class="home__title">Produtos</p>
    </div>-->
    <div class="box__card">
      <div v-for="product in products" :ref="product.id" class="card__product" @click="redirectToDetail(product.id)">
        <div class="card__product__box__img">
          <img :src="product.image" alt="imagen do produto" class="card__product__img"/>
        </div>
        <div class="card__product__boxtitle">
          <p>{{ formatCoinTOBRL(product.price) }}</p>
          <p>{{ product.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import Product from "../interfaces/Product";
import formatCoinBRL from "../utils/formatCoinBRL";
import Header from "../components/Header.vue";

interface Search {
  category: string,
  search: string
}

export default defineComponent({
  name: "Home",
  components: {Header},
  data() {
    return {
      products: [] as Product[],
    }
  },
  methods: {
    async listProducts(info?: Search) {
      const url = info?.category ? `products/category/${info?.category}` : "/products";
      try {
        const products = await api.get(url);
        if (!info?.search) {
          this.products = products.data;
        } else {
          const regex = new RegExp(info.search, 'gi');
          this.products = products.data.filter(item => item.title.match(regex));
        }
      } catch (err) {
        console.log(err)
      }
    },
    formatCoinTOBRL(coin: number) {
      return formatCoinBRL(coin);
    },
    redirectToDetail(id: number) {
      this.$router.push(`produto/${id}`)
    },
    filter(e: Search) {
      console.log(e)
      this.listProducts(e)
    }
  },
  mounted() {
    this.listProducts();
  }
})
</script>

<style scoped>
/*.home__title {
  font-family: "Montserrat";
  font-weight: 700;
  font-size: 28px;
  margin: 40px 0;
}*/

.box__card {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.card__product {
  width: 200px;
  cursor: pointer;
  border: 1px solid var(--white);
  border-radius: 15px;
  background: var(--gray-two);
}

.card__product:hover {
  box-shadow: 1px 1px 20px green;
  border-radius: 15px;
}

.card__product__box__img {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--white);
  padding: 20px;
  border-radius: 15px;
}

.card__product__box__img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card__product__boxtitle {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
