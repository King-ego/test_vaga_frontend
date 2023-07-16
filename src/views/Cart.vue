<template>
  <div>
    <Header/>
    <div>
      <div v-if="loading && !products.length" class="card flex-center flex-col content">Buscando ...</div>
      <div v-if="!loading  && !products.length" class="card flex-center flex-col content">
        <p>{{ amount ? "Carregando..." : "Carrinho Vazio" }}</p>
        <p v-if="!existToken">Você não está logado</p>
      </div>
      <div v-if="!loading && products.length">
        <div v-if="!step">
          <div class="card__close__buy flex justify-between">
            <p class="card__title">Preço Total: {{ formatCoinTOBRL(allPrice) }}</p>
            <button class="btn card__close__buy__button" @click="nextStep"> Finalizar pedido</button>
          </div>
          <div class="card flex flex-col gap-10px" v-for="(product, idx) in products" v-bind:key="product.id">
            <div class="card__img">
              <img :src="product?.image" alt="product"/>
            </div>
            <div class="flex-col flex gap-10px">
              <p>{{ product.title }}</p>
              <p>{{ formatCoinTOBRL(product.price) }}</p>
              <select @change="updateProduct(idx)" v-model="product.quantity">
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
              </select>
            </div>
            <div class="flex gap-10px">
              <button @click="removeProduct(idx)" class="btn btn-cart">Remove</button>
            </div>
          </div>
        </div>
        <div v-if="step" class="card flex-center flex-col content">
          Pedido Realizado Com Sucesso
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import Product from "../interfaces/Product";
import Header from "../components/Header.vue";
import formatCoinBRL from "../utils/formatCoinBRL";
import Cart from "../interfaces/Cart";
import moment from "moment/moment";

interface Products extends Product {
  quantity: number;
}

export default defineComponent({
  name: "Cart",
  components: {Header},
  data() {
    return {
      products: [] as Products[],
      loading: false,
      cart: {} as Cart,
      amount: 0,
      step: 0,
    }
  },
  methods: {
    async getCart() {
      this.loading = true;
      try {
        const id = localStorage.getItem("id");
        const cart = await api.get(`carts/user/${id}`);
        this.cart = cart.data[0];
        this.amount = cart.data[0].products.length;
        cart.data[0].products.map(async (product) => {
          const prt = await api.get(`products/${product.productId}`);
          this.products.push({...prt.data, quantity: product.quantity});
        })
      } catch (err) {
        console.log(err)
      }
      this.loading = false;
    },
    async updateProduct(position: number) {
      const quantity = this.products[position].quantity
      const id = this.products[position].id

      const cart = this.cart.products.filter((cart) => cart.productId !== id)
      this.cart.products = [...cart, {productId: id, quantity}]

      try {
        const adt = await api.put(`carts/${this.cart.id}`, this.cart)
        console.log({products: this.cart, adt})

      } catch (e) {
        console.log(e)
      }
    },
    async removeProduct(position: number) {
      const id = this.products[position].id

      const cart = this.cart.products.filter((cart) => cart.productId !== id)
      this.products.splice(position, 1)
      this.amount = this.amount - 1;
      try {
        if (this.amount) {
          const adt = await api.put(`carts/${this.cart.id}`, {...this.cart, products: cart})
          console.log({adt})
        } else {
          const adt = await api.delete(`carts/${this.cart.id}`)
          console.log({adt, text: "delete", cart: this.cart, products: this.products})
        }

      } catch (e) {
        console.log(e)
      }
    },
    formatCoinTOBRL(coin: number) {
      return formatCoinBRL(coin);
    },
    nextStep(){
      this.step = this.step + 1;
    },
  },
  computed: {
    allPrice() {
      return this.products.reduce((before, after) => {
        return before + (after.price * after.quantity)
      }, 0)
    },
    existToken() {
      const token = localStorage.getItem("token-api");
      return !!token;
    },
  },
  mounted() {
    this.getCart();
  }
})
</script>

<style scoped>
.card {
  background: var(--white);
  border-bottom: 1px solid var(--gray-three);
  padding: 20px 10px;
}

.card:last-child {
  margin-bottom: 40px
}

.card__img {
  width: 100px;
}

.card__img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.content {
  min-height: 200px;
}

select {
  border: 1px solid var(--gray-three);
  width: 40px;
}

.btn-cart {
  background: var(--gray-two);
  padding: 10px;
}

.card__close__buy {
  background: var(--white);
  border-bottom: 1px solid var(--gray-one);
  padding: 10px;
  height: 100px;
  display: flex;
  align-items: center;
}

.card__close__buy__button {
  background: var(--green-sea-light);
  padding: 10px;
  color: var(--white);
}
</style>
