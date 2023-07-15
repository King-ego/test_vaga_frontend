<template>
  <div>
    <div class="header">
      <div>
        <p @click="redirectHome" class="header__title">Adoorei Shop</p>
      </div>
      <div style="position: relative;">
        <button class="header__dropbox__button" @click="toggleDropBox">{{
            payload.category ? payload.category : "Todos"
          }} v
        </button>
        <div class="header__dropbox" v-if="dropdown">
          <p @click="setCategory('')" class="header__dropbox__item">Todos</p>
          <p @click="setCategory(category)" class="header__dropbox__item" v-for="(category, idx) in categories"
             v-bind:key="idx">{{ category }}</p>
        </div>
        <input class="header__dropbox__input" v-model="payload.search" placeholder="pesquisar"/>
        <button @click="search" class="header__dropbox__button">pesquisar</button>
      </div>
      <div style="display: flex; gap: 10px">
        <div class="amount__cart" @click="redirectCart">
          <span v-if="amountItemCart" class="amount__cart__item">{{ amountItemCart }}</span>
          <button class="amount__cart__img">
            <img class="imagen-container" src="/src/assets/icons/cart.png" alt="imagem de um carrinho de loja"/>
          </button>
        </div>
        <button class="header__dropbox__button" @click="submit" :title="existToken ? 'Sair' : 'Entrar'">
          <img class="imagen-container" alt="icone"
               :src="existToken ? '/src/assets/icons/logout.png': '/src/assets/icons/login.png'"/>
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import User from "../interfaces/User";

export default defineComponent({
  name: "Header",
  data() {
    return {
      categories: [] as string[],
      dropdown: false,
      amountItemCart: 0,
      istoken: false,
      payload: {
        category: "",
        search: "",
      }
    }
  },
  computed: {
    existToken() {
      const token = localStorage.getItem("token-api");
      return !!token;
    }
  },
  methods: {
    async submit() {
      try {
        if (!this.existToken) {
          const users = await api.get("users");
          const user = users.data.filter((usr: User) => usr.password === "83r5^_" && usr.username === "mor_2314");
          const token = await api.post("auth/login", {username: "mor_2314", password: "83r5^_"})
          localStorage.setItem("id", user[0].id)
          localStorage.setItem("token-api", token.data.token)
        } else {
          localStorage.removeItem("id");
          localStorage.removeItem("token-api");
        }
        this.$router.go(this.$router.currentRoute)
      } catch (err) {

      }
    },
    async getAllCategory() {
      try {
        const categories = await api.get("products/categories");
        console.log({data: categories.data, route: this.$route, router: this.$router});
        this.categories = categories.data;
      } catch (err) {
        console.log(err);
      }
    },
    toggleDropBox() {
      this.dropdown = !this.dropdown;
    },
    setCategory(category) {
      this.payload.category = category;
      this.search();
      this.toggleDropBox();
    },
    search() {
      this.$emit('search', this.payload);
    },
    async numberItemCart() {
      try {
        const id = localStorage.getItem("id");
        const cart = await api.get(`carts/user/${id}`);
        this.amountItemCart = cart?.data[0]?.products?.length;
      } catch (e) {
        console.log(e)
      }
    },
    redirectCart() {
      const token = localStorage.getItem("token-api")
      if (token) {
        this.$router.push("/cart")
      }

    },
    redirectHome() {
      this.$router.push("/")
    },
  },
  mounted() {
    this.getAllCategory();
    this.numberItemCart();
  }
})
</script>

<style scoped>
.header {
  background: var(--blue-black);
  min-height: 60px;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}

.header__title {
  color: var(--white);
  font-family: "Montserrat";
  font-weight: 700;
  cursor: pointer;
}

.header__dropbox {
  width: 150px;
  background: white;
  height: 200px;
  overflow-y: auto;
  position: absolute;
  border-radius: 0 0 2px 2px
}

.header__dropbox__button {
  height: 30px;
}

.header__dropbox__input {
  height: 30px;
}

.header__dropbox__item {
  width: 100%;
  cursor: pointer;
  padding: 5px;
}

.header__dropbox__item:hover {
  background: var(--gray-three);
}

.amount__cart {
  position: relative;
  display: flex;
  gap: 20px;
}

.amount__cart__img {
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.amount__cart__item {
  position: absolute;
  background: var(--red);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  right: -14px;
  top: -10px;
}
</style>
