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
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
      <ion-input v-model="affectedLevel.name"></ion-input>
    </ion-item>
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
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'LevelModal',
  props: [ 'level','title', 'action', 'stopList'],
  data() {
    return {
      affectedLevel: {
        id:null,
        name: ''
      }
    }
  },
  created() {
    if(this.level !== null){
      this.affectedLevel = this.level
    }
  },
  methods:{
    dismissModal(data) {
       modalController.dismiss(data);
      },
    save(){
      if(this.affectedLevel.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
      }

      if((this.level === null || this.affectedLevel.name !== this.level.name) && this.stopList.includes(this.affectedLevel.name)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }

      axios(this.affectedLevel.id === null? {
        method: 'POST',
        url: 'levels/',
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedLevel.name
        },
      }:{
        method: 'PUT',
        url: `levels/${this.affectedLevel.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedLevel.name
        }
      }).then(
          (response) => {
            console.log('saved')
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            this.dismissModal(
                {
                  id: this.affectedLevel.id !== null?this.affectedLevel.id: response.data.data.id,
                  name: this.affectedLevel.name,
                  isNew: this.affectedLevel.id === null
                }
            );
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