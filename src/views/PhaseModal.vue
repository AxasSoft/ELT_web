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
      <ion-input v-model="affectedPhase.name"></ion-input>
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
  name: 'PhaseModal',
  props: [ 'phase','title', 'action', 'level', 'stopList'],
  data() {
    return {
      affectedPhase: {
        id:null,
        name: ''
      }
    }
  },
  created() {
    if(this.phase !== null){
      this.affectedPhase = this.phase
    }
  },
  methods:{
    dismissModal(data) {
       modalController.dismiss(data);
      },
    save(){
      if(this.affectedPhase.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
      }

      if((this.phase === null || this.affectedPhase.name !== this.phase.name) && this.stopList.includes(this.affectedPhase.name)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }

      axios(this.affectedPhase.id === null? {
        method: 'POST',
        url: `levels/${this.level}/phases/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedPhase.name
        },
      }:{
        method: 'PUT',
        url: `phases/${this.affectedPhase.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedPhase.name
        }
      }).then(
          (response) => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            this.dismissModal(
                {
                  id: this.affectedPhase.id !== null?this.affectedPhase.id: response.data.data.id,
                  name: this.affectedPhase.name,
                  isNew: this.affectedPhase.id === null
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