<template>
<ion-page>
<ion-header :translucent="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button color="primary"></ion-menu-button>
      <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
      <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
    </ion-buttons>
    <ion-title>{{$root.dict[$root.currentLocale]['courses_h']}}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content :fullscreen="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">{{$root.dict[$root.currentLocale]['courses_h']}}</ion-title>
    </ion-toolbar>
  </ion-header>

  <div id="container">
    <div class="workspace">
      <div class="panel">
        <template v-if="$root.$data.user !== null && $root.$data.user.is_admin">
        <ion-button
            size="small"
            @click="openModal(
                null,
                $root.dict[$root.currentLocale]['course_h'],
                $root.dict[$root.currentLocale]['save']
                )"
        >
          {{$root.dict[$root.currentLocale]['add_course_btn']}}
        </ion-button>
        </template>
      </div>
      <div>
        <ion-item v-for="course in courses" :key="course.id">
          <ion-label>{{course.name}}</ion-label>
          <ion-button slot="end" :href="'/t/courses/'+course.id+'/categories/'">{{$root.dict[$root.currentLocale]['categories_lbl']}}</ion-button>
          <template v-if="$root.$data.user !== null && $root.$data.user.is_admin">
          <ion-button
              slot="end"
              @click="openModal(
                  course,
                  $root.dict[$root.currentLocale]['course_h'],
                  $root.dict[$root.currentLocale]['save']
              )"
          >
            {{$root.dict[$root.currentLocale]['edit']}}
          </ion-button>
          </template>
        </ion-item>
      </div>
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
import axios from "axios";
import CourseModal from "@/views/CourseModal";

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
      courses: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {

    init() {
      axios({
        method: "GET",
        url: 'courses/',
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.courses = response.data.data;
          }
      );


    },
    async openModal(course, title, action) {

      const modal = await modalController
          .create({
            component: CourseModal,
            componentProps: {
              title,
              course,
              action,
              stopList: this.courses.map(e => e.name)
            },

          })

      modal.onDidDismiss()
          .then(() => {
                this.init();
              }
          );

      return modal.present();
    },
  }
}
</script>

<style scoped>

</style>