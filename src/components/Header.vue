<template>
<div>
  <button @click="submit">Entrar</button>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import api from "../services/api";
import User from "../interfaces/User";

export default defineComponent({
  name: "Header",
  methods: {
    async submit(){
      try {
        const users = await api.get("users")
        const user = users.data.filter((usr:User)=>usr.password === "m38rmF$" && usr.username === "johnd");
        const token = await api.post("auth/login", {username: "johnd", password: "m38rmF$"})
        localStorage.setItem("id", user[0].id)
        localStorage.setItem("token-api", token.data.token)
      } catch (err) {

      }
    }
  }
})
</script>

<style scoped>

</style>
