<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{$root.dict[$root.currentLocale]['contacts_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{$root.dict[$root.currentLocale]['contacts_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
        <ion-textarea
            v-model="text"
            rows="10"
        >
        </ion-textarea>
        <div class="panel">
          <ion-button slot="end" @click="save">{{$root.dict[$root.currentLocale]['save']}}</ion-button>
        </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonTextarea, IonButton } from '@ionic/vue';
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
    IonToolbar,
    IonTextarea,
    IonButton
  },
  data(){
    return {
      text: ''
    }
  },
  mounted() {
    axios({
      method: "GET",
      url: 'contacts/',
      headers: {
        "Authorization": `Token ${localStorage.getItem('token') || ''}`
      }
    }).then(
        response => {
          this.text = response.data.data.text
        }
    )
  },
  methods:{
    save(){
      if(this.text === ''){
        alert()
        return
      }
      axios(
          {
            method: 'PUT',
            url: `contacts/`,
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            },
            data:{
              text: this.text
            }
          }
      ).then(
          () => {
            console.log('saved')
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
          }
      )
    }

  }
}
</script>

<style scoped>

</style>