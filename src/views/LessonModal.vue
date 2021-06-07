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
      <ion-label >{{$root.dict[$root.currentLocale]['phase_h']}}</ion-label>
      <ion-select
          :value="affectedLesson.phase_id"
          v-on:ionChange="optionChanged"
          :ok-text="$root.dict[$root.currentLocale]['ok_btn']"
          :cancel-text="$root.dict[$root.currentLocale]['cancel_btn']"
      >
        <ion-select-option
            v-for="phase in phases"
            :key="phase.id" :value="phase.id"

        >
          {{phase.name}}
        </ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
      <ion-input v-model="affectedLesson.name"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['url_lbl']}}</ion-label>
      <ion-input v-model="affectedLesson.url"></ion-input>
    </ion-item>
    <ion-item v-if="$root.$data.user !== null && $root.$data.user.bot.id === 0" class="check-item">
      <ion-checkbox v-model="affectedLesson.sis">

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
  IonCheckbox
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'LessonModal',
  props: [ 'lesson','title','action', 'phase', 'stopList'],
  data() {
    return {
      affectedLesson: {
        id:null,
        name: '',
        url: '',
        'phase_id': +this.phase
      },
      phases:[]
    }
  },
  created() {

    axios({
      method: "GET",
      url: `phases/`,
      headers: {
        "Authorization": `Token ${localStorage.getItem('token') || ''}`
      }
    }).then(
        response => {
          this.phases = response.data.data
        }
    )

    if(this.lesson !== null){
      this.affectedLesson =  {...this.lesson}
    }
  },
  methods:{
    dismissModal(data) {
      modalController.dismiss(data);
    },
    save(){
      if(this.affectedLesson.name === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
        return
      }
      if(this.affectedLesson.url === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_url'])
        return
      }

      if((this.lesson === null || this.affectedLesson.name !== this.lesson.name) && this.stopList.includes(this.affectedLesson.name)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_text'])
        return
      }

      axios(this.affectedLesson.id === null? {
        method: 'POST',
        url: `phases/${this.phase}/lessons/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedLesson.name,
          url: this.affectedLesson.url,
          sis: this.affectedLesson.sis
        },
      }:{
        method: 'PUT',
        url: `lessons/${this.affectedLesson.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedLesson.name,
          url: this.affectedLesson.url,
          sis: this.affectedLesson.sis
        }
      }).then(
          (response) => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])

            this.dismissModal(
                {
                  id: this.affectedLesson.id !== null?this.affectedLesson.id: response.data.data.id,
                  name: this.affectedLesson.name,
                  url: this.affectedLesson.url,
                  isNew: this.affectedLesson.id === null
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
      this.affectedLesson['phase_id'] = event.target.value
    },
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel, IonCheckbox }
});
</script>

<style scoped>

</style>