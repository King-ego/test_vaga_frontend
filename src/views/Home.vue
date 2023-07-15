<template>
  <div>
    <Header @search="filter"/>
    <Banner/>
    <div class="box__card">
      <div v-for="product in OrdemProductsBy" :ref="product.id" class="card__product" @click="redirectToDetail(product.id)">
        <div class="card__product__box__img">
          <img :src="product.image" alt="imagen do produto" class="imagen-container"/>
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
import Banner from "../components/Banner.vue";

interface Search {
  category: string;
  search: string;
  type_search: string;
}

export default defineComponent({
  name: "Home",
  components: {Banner, Header},
  data() {
    return {
      products: [] as Product[],
      type_ordem: "",
    }
  },
  methods: {
    async listProducts(info?: Search) {
      const url = info?.category ? `products/category/${info?.category}` : "/products";
      try {
        const products = await api.get(url);
        this.type_ordem = info?.type_search || "Nome";
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
      this.listProducts(e)
    }
  },
  computed: {
    OrdemProductsBy() {
      if (this.type_ordem === 'Preço') {
        return this.products.sort((a, b) => a.price - b.price)
      }
      if (this.type_ordem === 'Avaliação') {
        return this.products.sort((a, b) => a.rating.rate - b.rating.rate)
      }
      if (this.type_ordem === "Nome" || !this.type_ordem) {
        return this.products.sort((a, b) => {
          const nameA = a.title.toUpperCase();
          const nameB = b.title.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }

    },
  },
  mounted() {
    this.listProducts();
  }
})
</script>

<style scoped>
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

.card__product__boxtitle {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
