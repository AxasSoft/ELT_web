<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{ $root.dict[$root.currentLocale]['profile_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $root.dict[$root.currentLocale]['profile_h'] }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <section>
            <h1>{{$root.dict[$root.currentLocale]['user_sh']}}</h1>
            <ion-item>
              <ion-label position="stacked">{{$root.dict[$root.currentLocale]['new_password_lbl']}}</ion-label>
              <ion-input  type="password"  v-model="user.newPassword"></ion-input>
            </ion-item>
            <ion-button @click="savePassword">{{$root.dict[$root.currentLocale]['save']}}</ion-button>
          </section>
          <section v-if="$root.$data.user !== null && $root.$data.user.bot_owner">
            <h1>{{$root.dict[$root.currentLocale]['bot_sh']}}</h1>
            <ion-item>
              <ion-label position="stacked">{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
              <ion-input v-model="$root.$data.user.bot.name"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{$root.dict[$root.currentLocale]['token_lbl']}}</ion-label>
              <ion-input v-model="$root.$data.user.bot.token"></ion-input>
            </ion-item>
            <ion-button @click="saveBot">{{$root.dict[$root.currentLocale]['save']}}</ion-button>
          </section>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
    IonInput,
    IonItem,
    IonLabel
} from '@ionic/vue';
import axios from "axios";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Profile',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonLabel
  },
  data(){
    return {
      user:{
        newPassword: ''
      }
    }
  },
  methods:{
    savePassword(){
      axios(
          {
            method:'PUT',
            url:'users/self/password/',
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            },
            data: {
              password: this.user.newPassword
            },
          }
      ).then(
          () => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
          }
      ).catch(
          (error) => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    },
    saveBot(){
      axios(
          {
            method:'PUT',
            url:'bot/',
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            },
            data: {
              name: this.$root.$data.user.bot.name,
              token: this.$root.$data.user.bot.token
            },
          }
      ).then(
          () => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
          }
      ).catch(
          (error) => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    }
  }
})
</script>

<style scoped>


</style>