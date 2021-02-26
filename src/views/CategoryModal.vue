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
      <ion-input v-model="affectedCategory.name"></ion-input>
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
  name: 'CategoryModal',
  props: [ 'category','title','action', 'stopList'],
  data() {
    return {
      affectedCategory: {
        id:null,
        name: ''
      }
    }
  },
  created() {
    if(this.category !== null){
      this.affectedCategory = this.category
    }
  },
  methods:{
    dismissModal(data) {
      modalController.dismiss(data);
    },
    save(){
      if(this.affectedCategory.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
        return
      }
      if((this.category === null || this.affectedCategory.name !== this.category.name) && this.stopList.includes(this.affectedCategory.name)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }
      axios(this.affectedCategory.id === null? {
        method: 'POST',
        url: `categories/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedCategory.name,
        },
      }:{
        method: 'PUT',
        url: `categories/${this.affectedCategory.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedCategory.name,
        }
      }).then(
          (response) => {
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            console.log('Saved');
            this.dismissModal(
                {
                  id: this.affectedCategory.id !== null?this.affectedCategory.id: response.data.data.id,
                  name: this.affectedCategory.name,
                  isNew: this.affectedCategory.id === null
                }
            );
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'],'danger')
          }
      )

    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel }
});
</script>

<style scoped>

</style>