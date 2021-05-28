<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title >


          <div>{{$root.dict[$root.currentLocale]['login_h']}}</div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">

            {{$root.dict[$root.currentLocale]['login_h']}}
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">

          <ion-list>
          <ion-list-header class="big-logo">
            <div>ELT Bot</div>
            <ion-button @click="$root.changeLocale">
              {{$root.currentLocale}}
            </ion-button>
          </ion-list-header>

          <ion-item>
            <ion-label position="stacked">{{$root.dict[$root.currentLocale]['login_lbl']}}</ion-label>
            <ion-input v-model="user.login"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">{{$root.dict[$root.currentLocale]['password_lbl']}}</ion-label>
            <ion-input v-model="user.password" type="password"></ion-input>
          </ion-item>
          <div>
            <ion-button slot="end" @click="login">{{$root.dict[$root.currentLocale]['login_btn']}}</ion-button>
            <ion-button slot="end" @click="openModal">{{$root.dict[$root.currentLocale]['reset_password_btn']}}</ion-button>
          </div>

          </ion-list>
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
  IonButton,
  IonInput, modalController
} from '@ionic/vue';
import axios from "axios";
import router from "@/router";

import ResetPasswordModal from "@/views/ResetPasswordModal";


export default {
  name: 'Login`',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput
  },
  data(){
    return {
      user:{
        login: '',
        password: ''
      }
    }
  },
  mounted() {
    localStorage.setItem('token','')
  },
  methods:{

    init(){
      this.user = {
      login: '',
      password: ''
    }
    },
    login(){
      axios(
          {
            method: "POST",
            url: 'auth/',
            data: this.user
          }
      ).then(
          response => {
            localStorage.setItem('token', response.data.data.token);
            this.$root.$data.user = {
              login: response.data.data.login,
              name: response.data.data.name,
              'is_admin': response.data.data.is_admin,
              'bot_owner': response.data.data['bot_owner'],
              'bot': response.data.data.bot
            }
            router.push('/')

          }
      ).catch(
          () => {
              this.$root.notify(this.$root.dict[this.$root.currentLocale]['incorrect_password'],'danger')
          }
      )
    },
    async openModal() {

      const modal = await modalController
          .create({
            component: ResetPasswordModal,
          })

      modal.onDidDismiss()
          .then(() => {
            this.init()
          });

      return modal.present();
    },

  }
}
</script>

<style scoped>

</style>