<template>
  <div>
    <div class="header">
      <div>
        <p @click="redirectHome" class="header__title">Adoorei Shop</p>
      </div>
      <div class="relative flex">
        <button class="header__dropbox__button btn btn__dropdown flex-center" @click="toggleDropBox">{{
            payload.category ? payload.category : "Todos"
          }}
          <img class="imagen-container" style="width: 15px" src="/src/assets/icons/expand_more.png" alt="chevron-bottom">
        </button>
        <button class="header__dropbox__button btn btn__dropdown flex-center" style="border-radius: 0" @click="toggleDropBoxTypeOrdem">{{ payload.type_search }}
          <img class="imagen-container" style="width: 15px" src="/src/assets/icons/expand_more.png" alt="chevrom-bottom">
        </button>
        <div class="header__dropbox" v-if="dropdown">
          <p @click="setCategory('')" class="header__dropbox__item">Todos</p>
          <p @click="setCategory(category)" class="header__dropbox__item" v-for="(category, idx) in categories"
             v-bind:key="idx">{{ category }}</p>
        </div>
        <div class="header__dropbox" v-if="dropdown__type">
          <p @click="setTypeSearch('Nome')" class="header__dropbox__item">Nome</p>
          <p @click="setTypeSearch('Preço')" class="header__dropbox__item">Preço</p>
          <p @click="setTypeSearch('Avaliação')" class="header__dropbox__item">Avaliação</p>
        </div>
        <input class="header__dropbox__input" v-model="payload.search" placeholder="pesquisar"/>
        <button @click="search" class="header__dropbox__button btn btn__searc">
          <img class="imagen-container" src="/src/assets/icons/search.png" alt="lupa"/>
        </button>
      </div>
      <div class="box__button__left">
        <div class="amount__cart" @click="redirectCart">
          <span v-if="amountItemCart" class="amount__cart__item">{{ amountItemCart }}</span>
          <button class="amount__cart__img btn bg-transparent">
            <img class="imagen-container" src="/src/assets/icons/cart.svg" alt="imagem de um carrinho de loja"/>
          </button>
        </div>
        <button class="header__dropbox__button btn bg-transparent" @click="submit"
                :title="existToken ? 'Sair' : 'Entrar'">
          <img class="imagen-container" alt="icone"
               :src="existToken ? '/src/assets/icons/logout.svg': '/src/assets/icons/login.svg'"/>
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
      dropdown__type: false,
      amountItemCart: 0,
      istoken: false,
      payload: {
        category: "",
        search: "",
        type_search: "Nome"
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
      this.dropdown__type = false;
    },
    toggleDropBoxTypeOrdem() {
      this.dropdown__type = !this.dropdown__type;
      this.dropdown = false;
    },
    setCategory(category) {
      this.payload.category = category;
      this.search();
      this.toggleDropBox();
    },
    setTypeSearch(type_search: string) {
      this.payload.type_search = type_search;
      this.search();
      this.toggleDropBoxTypeOrdem();
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
  height: 150px;
  overflow-y: auto;
  position: absolute;
  border-radius: 0 0 10px 10px;
  z-index: 99;
  top: 30px;
}

.header__dropbox__button {
  height: 30px;
}

.header__dropbox__input {
  height: 30px;
  padding: 5px;
  border: 1px solid var(--white);
  border-left: 2px solid var(--gray-three);
}

.header__dropbox__item {
  width: 100%;
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid var(--gray-three);
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

.box__button__left {
  display: flex;
  gap: 10px;
}

.btn__dropdown {
  border-radius: 5px 0 0 5px;
}

.btn__searc {
  border-radius: 0 5px 5px 0;
}
</style>
