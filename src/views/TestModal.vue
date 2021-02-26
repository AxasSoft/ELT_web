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
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
      <ion-input v-model="affectedTest.name"></ion-input>
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
  name: 'TestModal',
  props: [ 'test','title','action', 'category', 'stopList'],
  data() {
    return {
      affectedTest: {
        id:null,
        name: '',
        url: ''
      }
    }
  },
  created() {
    if(this.test !== null){
      this.affectedTest = this.test
    }
  },
  methods:{
    dismissModal(data) {
      modalController.dismiss(data);
    },
    save(){
      if(this.affectedTest.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
        return
      }
      if((this.test === null || this.affectedTest.name !== this.test.name) && this.stopList.includes(this.affectedTest.name)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }
      axios(this.affectedTest.id === null? {
        method: 'POST',
        url: `categories/${this.category}/tests/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedTest.name
        },
      }:{
        method: 'PUT',
        url: `tests/${this.affectedTest.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedTest.name,
        }
      }).then(
          (response) => {
            console.log('Saved');
            this.dismissModal(
                {
                  id: this.affectedTest.id !== null?this.affectedTest.id: response.data.data.id,
                  name: this.affectedTest.name,
                  isNew: this.affectedTest.id === null
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