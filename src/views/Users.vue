<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{$root.dict[$root.currentLocale]['users_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{$root.dict[$root.currentLocale]['users_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="panel">
            <ion-button size="small" @click="openModal(null,$root.dict[$root.currentLocale]['user_h'],$root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['add_user_btn']}}</ion-button>
          </div>
          <div class="scrollable">
          <ion-list>
            <ion-item>
              <ion-label>
                <strong>{{$root.dict[$root.currentLocale]['login_lbl']}}</strong>
              </ion-label>
              <ion-label>
                <strong>{{$root.dict[$root.currentLocale]['hname_lbl']}}</strong>
              </ion-label>
              <ion-label>
              </ion-label>
            </ion-item>
            <ion-item v-for="user in users" :key="user.id">
              <ion-label>{{user.login}}</ion-label>
              <ion-label>{{user.name}}</ion-label>
              <ion-label>
                <ion-button color="primary" @click="openModal(user,$root.dict[$root.currentLocale]['user_h'],$root.dict[$root.currentLocale]['save'])">
                  {{$root.dict[$root.currentLocale]['edit']}}
                </ion-button>
              </ion-label>
            </ion-item>
          </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,  modalController} from '@ionic/vue';
import UserModal from './UserModal.vue';
import axios from "axios";

export default {
  name: 'Folder',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
  },
  data(){
    return {
      users: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {

    init(){
      axios({
        method: "GET",
        url: 'users/',
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.users = response.data.data
          }
      )
    },

    async openModal( user, title, action) {
      const modal = await modalController
          .create({
            component: UserModal,
            componentProps: {
              title: title,
              user: user,
              action: action,
              stopList: this.users.map(e => e.login)
            },

          })

      modal.onDidDismiss()
          .then(() => {
                this.init()
              }
          );

      return modal.present();
    }
  },
}
</script>

<style scoped>

</style>