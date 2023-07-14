<template>
  <div>
    <div class="header">
      <div>
        <p class="header__title">Adoorei Shop</p>
      </div>
      <div style="position: relative;">
        <button class="header__dropbox__button" @click="toggleDropBox">{{ payload.category ? payload.category : "Todos" }} v</button>
        <div class="header__dropbox" v-if="dropdown">
          <p @click="setCategory('')" class="header__dropbox__item" >Todos</p>
          <p @click="setCategory(category)" class="header__dropbox__item" v-for="(category, idx) in categories" v-bind:key="idx">{{ category }}</p>
        </div>
        <input class="header__dropbox__input" v-model="payload.search" placeholder="pesquisar"/>
        <button @click="search" class="header__dropbox__button">pesquisar</button>
      </div>
      <button class="header__dropbox__button" @click="submit">Entrar</button>
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
      payload: {
        category: "",
        search: "",
      }
    }
  },
  methods: {
    async submit() {
      try {
        const users = await api.get("users");
        const user = users.data.filter((usr: User) => usr.password === "83r5^_" && usr.username === "mor_2314");
        const token = await api.post("auth/login", {username: "mor_2314", password: "83r5^_"})
        localStorage.setItem("id", user[0].id)
        localStorage.setItem("token-api", token.data.token)
      } catch (err) {

      }
    },
    async getAllCategory() {
      try {
        const categories = await api.get("products/categories");
        console.log({data:categories.data, route: this.$route, router: this.$router});
        this.categories = categories.data;
      } catch (err) {
        console.log(err);
      }
    },
    toggleDropBox(){
      this.dropdown = !this.dropdown;
    },
    setCategory(category){
      this.payload.category = category;
      this.toggleDropBox();
    },
    search(){
      this.$emit('search', this.payload);
    }
  },
  mounted() {
    this.getAllCategory();
  }
})
</script>

<style scoped>
.header {
  background: var(--white-black);
  min-height: 60px;
  display: flex;
  align-items: center;
  padding: 10px;
}

.header__title {
  color: var(--white);
  font-family: "Montserrat";
  font-weight: 700;
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
</style>
