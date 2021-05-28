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
      <ion-label >{{$root.dict[$root.currentLocale]['category_h']}}</ion-label>
      <ion-select
          :value="affectedTest.category_id"
          v-on:ionChange="optionChanged"
          :ok-text="$root.dict[$root.currentLocale]['ok_btn']"
          :cancel-text="$root.dict[$root.currentLocale]['cancel_btn']"
      >
        <ion-select-option
            v-for="category in categories"
            :key="category.id" :value="category.id"

        >
          {{category.name}}
        </ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
      <ion-input v-model="affectedTest.name"></ion-input>
    </ion-item>
    <ion-item v-if="$root.$data.user !== null && $root.$data.user.bot.id === 0">
      <ion-checkbox v-model="affectedTest.sis">

      </ion-checkbox>
      <ion-label>{{$root.dict[$root.currentLocale]['sis']}}</ion-label>
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
  modalController,
    IonSelect,
    IonSelectOption,
  IonCheckbox,
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
        url: '',
        'category_id': +this.category
      },
      categories: []
    }
  },
  created() {
    axios({
      method: "GET",
      url: `categories/`,
      headers: {
        "Authorization": `Token ${localStorage.getItem('token') || ''}`
      }
    }).then(
        response => {
          this.categories = response.data.data
        }
    )
    if(this.test !== null){
      this.affectedTest = {...this.test, 'category_id':+this.category}
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
        url: `categories/${this.affectedTest['category_id']}/tests/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedTest.name,
          sis: this.affectedTest.sis
        },
      }:{
        method: 'PUT',
        url: `tests/${this.affectedTest.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedTest.name,
          'category_id': this.affectedTest['category_id'],
          sis: this.affectedTest.sis
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

    },
    optionChanged(event) {
      this.affectedTest['category_id'] = event.target.value
    },
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel, IonSelect, IonSelectOption, IonCheckbox }
});
</script>

<style scoped>

</style>