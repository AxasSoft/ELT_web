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
      <ion-input v-model="affectedCourse.name"></ion-input>
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
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'СщгкыуModal',
  props: [ 'course','title', 'action', 'stopList'],
  data() {
    return {
      affectedCourse: {
        id:null,
        name: ''
      }
    }
  },
  created() {
    if(this.course !== null){
      this.affectedCourse = {...this.course};

    }
  },
  methods: {
    dismissModal(data) {
      modalController.dismiss(data);
    },
    save() {
      if (this.affectedCourse.name === '') {
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
      }

      if ((this.course === null || this.affectedCourse.name !== this.course.name) && this.stopList.includes(this.affectedCourse.name)) {
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }

      axios(this.affectedCourse.id === null ? {
        method: 'POST',
        url: `courses/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedCourse.name
        },
      } : {
        method: 'PUT',
        url: `courses/${this.affectedCourse.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedCourse.name,
        }
      }).then(
          (response) => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            this.dismissModal(
                {
                  id: this.affectedCourse.id !== null ? this.affectedCourse.id : response.data.data.id,
                  name: this.affectedCourse.name,
                  isNew: this.affectedCourse.id === null
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
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel}
});
</script>

<style scoped>

</style>