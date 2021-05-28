<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{title}}</ion-title>
      <ion-buttons slot="end">
        <ion-button  @click="dismissModal">{{$root.dict[$root.currentLocale]['close_btn']}}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['hname_lbl']}}</ion-label>
      <ion-input v-model="affectedUser.name"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['login_lbl']}}</ion-label>
      <ion-input v-model="affectedUser.login"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['email_lbl']}}</ion-label>
      <ion-input v-model="affectedUser.email"></ion-input>
    </ion-item>
    <ion-item v-if="affectedUser.id === null || !doNotChangePassword">
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['password_lbl']}}</ion-label>
      <ion-input type="password" v-model="affectedUser.password"></ion-input>
    </ion-item>
    <ion-item v-if="affectedUser.id!==null">
      <ion-checkbox
          v-model="doNotChangePassword"
      >
      </ion-checkbox>
      <ion-label>{{$root.dict[$root.currentLocale]['dontchangepassword']}}</ion-label>
    </ion-item>
    <div v-if="$root.$data.user !== null && $root.$data.user.bot.id === 0">
      <ion-checkbox v-model="botOwner">

      </ion-checkbox>
      <ion-label>{{$root.dict[$root.currentLocale]['bot_owner']}}</ion-label>
      <div v-if="botOwner">
        <ion-item>
          <ion-label position="stacked">telegram id</ion-label>
          <ion-input v-model="telegramId"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
          <ion-input v-model="bot.name"></ion-input>
        </ion-item>
      </div>
    </div>
    <div><ion-button slot="end" @click="save">{{action}}</ion-button></div>
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
  IonCheckbox
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'UserModal',
  props: [ 'user','title', 'action', 'stopList'],
  data() {
    return {
      affectedUser: {
        id:null,
        login: '',
        password: '',
        name: '',
      },
      telegramId: null,
      doNotChangePassword: false,
      botOwner: false,
      bot:{
        name: ''
      }
    }
  },
  created() {
    if(this.user !== null){
      this.affectedUser = {...this.user, password: ''}
    }
  },
  methods:{
    dismissModal(data) {
       modalController.dismiss(data);
      },
    save(){
      if(this.affectedUser.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
        return
      }
      if(this.affectedUser.login === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_login'])
        return
      }
      if(!this.doNotChangePassword && this.affectedUser.password === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_password'])
        return
      }

      if((this.user === null || this.affectedUser.login !== this.user.login) && this.stopList.includes(this.affectedUser.login)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_login'])
        return
      }

      if(this.affectedUser.email === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_email'])
        return
      }

      const data = {
            name: this.affectedUser.name,
            login: this.affectedUser.login,
            password: this.affectedUser.password,
            email: this.affectedUser.email,
            bot: this.botOwner? {
              name: this.bot.name
            }: null
          }

      if(this.botOwner){
        data['telegram_id'] = this.telegramId
      }

      axios(this.affectedUser.id === null? {
        method: 'POST',
        url: `users/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: data
      }:{
        method: 'PUT',
        url: `users/${this.affectedUser.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: this.doNotChangePassword?
            {
              name: this.affectedUser.name,
              login: this.affectedUser.login,
              email: this.affectedUser.email,
            }:{
              name: this.affectedUser.name,
              login: this.affectedUser.login,
              email: this.affectedUser.email,
              password: this.affectedUser.password,
            }
      }).then(
          (response) => {
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])

            this.dismissModal(
                {
                  id: this.affectedUser.id !== null?this.affectedUser.id: response.data.data.id,
                  name: this.affectedUser.name,
                  login: this.affectedUser.login,
                  isNew: this.affectedUser.id === null
                }
            );
          }
      ).catch(
          error => {
            console.error(error)
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'],'danger')
          }
      )

    }
    },

  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel, IonCheckbox }
});
</script>

<style scoped>

</style>