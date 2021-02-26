<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>Lessons</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Lessons</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="panel">
            <ion-button size="small" @click="openModal(null,$root.dict[$root.currentLocale]['lesson_h'],$root.dict[$root.currentLocale]['save'], $route.params.phase_id)">
              {{$root.dict[$root.currentLocale]['add_lesson_btn']}}
            </ion-button>
          </div>
          <ion-list>
            <ion-item v-for="lesson in lessons" :key="lesson.id">
              <ion-label>{{lesson.name}}</ion-label>
              <ion-button slot="end" @click="openModal(lesson, $root.dict[$root.currentLocale]['lesson_h'],$root.dict[$root.currentLocale]['save'], $route.params.phase_id)">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button color="danger" slot="end" @click="deleteLesson(lesson.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import LessonModal from "@/views/LessonModal.vue";
import axios from "axios";
import PhaseModal from "@/views/PhaseModal";

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
      lessons:[]
    }
  },
  mounted(){
   this.init()
  },
  methods: {

    init(){
      axios({
        method: "GET",
        url: `phases/${this.$route.params.phase_id}/lessons/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.lessons = response.data.data
          }
      )
    },
    async openModal(lesson, title, action, phase) {
      const modal = await modalController
          .create({
            component: LessonModal,
            componentProps: {
              title,
              lesson,
              action,
              phase,
              stopList:  this.lessons.map(e => e.name)
            },

          })
      modal.onDidDismiss()
          .then(() => {
                this.init()
              }
          );
      return modal.present();
    },
    deleteLesson(lessonId){
      axios({
        method: "DELETE",
        url: `lessons/${lessonId}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          () => {
            console.log('Deleted');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['deleted_ntf'])
            this.init()
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    }
  }
}
</script>

<style scoped>


</style>