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
            <template v-if="$root.$data.user !== null && $root.$data.user.is_admin && $root.$data.user.bot.id === 0">
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

              <ion-button size="small" @click="toggleReorder">
                {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
              </ion-button>
            </template>
          </div>
          <div class="scrollable">
          <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">
            <ion-item v-for="course in courses" :key="course.id">
              <ion-label>{{course.name}}</ion-label>
              <ion-button slot="end" :href="'/k/courses/'+course.id+'/kb/'">{{$root.dict[$root.currentLocale]['levels_lbl']}}</ion-button>
              <template v-if="$root.$data.user !== null && $root.$data.user.is_admin && $root.$data.user.bot.id === 0">
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
                <ion-button color="danger" slot="end" @click="deleteCourse(course.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
                <ion-reorder slot="end"></ion-reorder>
              </template>

            </ion-item>
          </ion-reorder-group>
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
      courses: [],
      reorder: false
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
    doReorder(event) {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete');

      this.courses = event.detail.complete(this.courses);

      // After complete is called the items will be in the new order
      console.log('After complete');
    },
    toggleReorder(){
      this.reorder = !this.reorder;
      if(!this.reorder){
        console.log('Saved');
        axios({
              method: 'POST',
              url: `courses/order/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
              data: {
                'order':this.courses.map(value => value.id)
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
    },
    deleteCourse(courseId){

      if(!confirm(this.$root.dict[this.$root.currentLocale]['delete_q'])){
        return
      }

      axios({
        method: "DELETE",
        url: `courses/${courseId}/`,
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
  }
}
</script>

<style scoped>

</style>