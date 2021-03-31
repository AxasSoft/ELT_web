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
            <ion-button size="small" @click="toggleReorder">
              {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
            </ion-button>
          </div>
          <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">
            <ion-item v-for="lesson in lessons" :key="lesson.id">
              <ion-label>{{lesson.name}}</ion-label>
              <ion-button slot="end" @click="openModal(lesson, $root.dict[$root.currentLocale]['lesson_h'],$root.dict[$root.currentLocale]['save'], $route.params.phase_id)">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button color="danger" slot="end" @click="deleteLesson(lesson.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          </ion-reorder-group>
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
  modalController,
    IonReorderGroup,
    IonReorder
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
    IonToolbar,
    IonReorderGroup,
    IonReorder
  },
  data(){
    return {
      lessons:[],
      reorder: false
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
    },
    doReorder(event) {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete');

      this.lessons = event.detail.complete(this.lessons);

      // After complete is called the items will be in the new order
      console.log('After complete');
    },
    toggleReorder(){
      this.reorder = !this.reorder;
      if(!this.reorder){
        console.log('Saved');
        axios({
              method: 'POST',
              url: `lessons/order/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
              data: {
                'order':this.lessons.map(value => value.id)
              }
            }
        ).then(
            () => {
              this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
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
}
</script>

<style scoped>


</style>