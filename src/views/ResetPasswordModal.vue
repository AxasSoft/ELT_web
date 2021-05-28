<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{$root.dict[$root.currentLocale]['reset_password_h']}}</ion-title>
      <ion-buttons slot="end">
        <ion-button  @click="dismissModal">{{$root.dict[$root.currentLocale]['close_btn']}}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" v-if="step === 0">
    <ion-item>
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['email_lbl']}}</ion-label>
      <ion-input v-model="email"></ion-input>
    </ion-item>
    <div><ion-button slot="end" @click="sendEmail">{{$root.dict[$root.currentLocale]['send_email_a']}}</ion-button></div>
  </ion-content>
  <ion-content class="ion-padding" v-if="step === 1">
    <ion-item>
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['confirm_code_lbl']}}</ion-label>
      <ion-input v-model="confirmCode"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['new_password_lbl']}}</ion-label>
      <ion-input type="password" v-model="newPassword"></ion-input>
    </ion-item>
    <div><ion-button slot="end" @click="sendNewPassword">{{$root.dict[$root.currentLocale]['reset_password_a']}}</ion-button></div>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  modalController,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'ResetPasswordModal',
  data() {
    return {
      confirmCode: '',
      newPassword: '',
      email: '',
      step: 0
    }
  },

  methods:{
    dismissModal(data) {
       modalController.dismiss(data);
      },
    sendEmail(){
      if(this.email === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_confirm_email'])
      }

      axios(
          {
            method:'POST',
            url:'code/',
            data: {
              email: this.email,
              lang: this.$root.currentLocale
            },
          }
      ).then(
          () => {
            this.step = 1;
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    },
    sendNewPassword(){
      if(this.confirmCode === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_confirm_Code'])
      }

      if(this.confirmCode === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_new_password'])
      }

      axios(
          {
            method:'PUT',
            url:'users/self/password/recover/',
            data: {
              email: this.email,
              password: this.newPassword,
              code: this.confirmCode
            },
          }
      ).then(
          () => {
            console.log('saved')
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            this.dismissModal();
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )

    }
    },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel }

});
</script>

<style scoped>

</style>