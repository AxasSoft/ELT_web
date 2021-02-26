<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{$root.dict[$root.currentLocale]['questions_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{$root.dict[$root.currentLocale]['questions_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="panel">
            <ion-button
                size="small"
                @click="openOAQModal(null,$root.dict[$root.currentLocale]['question_h'],$root.dict[$root.currentLocale]['save'])"
            >
              {{$root.dict[$root.currentLocale]['add_question_btn']}} {{$root.dict[$root.currentLocale]['woa']}}
            </ion-button>
          </div>
          <div class="panel">
            <ion-button
                size="small"
                @click="openCAQModal(null,$root.dict[$root.currentLocale]['question_h'],$root.dict[$root.currentLocale]['save'])"
            >
              {{$root.dict[$root.currentLocale]['add_question_btn']}} {{$root.dict[$root.currentLocale]['wal']}}
            </ion-button>
          </div>
          <ion-list>
            <ion-item v-for="question in questions" :key="question.id">
              <ion-label>{{question.text}}</ion-label>
              <ion-label>{{question.correct_answer !== null?$root.dict[$root.currentLocale]['woa']: $root.dict[$root.currentLocale]['wal']}}</ion-label>
              <ion-button slot="end" @click="edit(question,$root.dict[$root.currentLocale]['question_h'],$root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button color="danger" slot="end" @click="deleteQuestion(question.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
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
import axios from "axios";
import OAQuestionModal from "@/views/OAQuestionModal";
import CAQuestionModal from "@/views/CAQuestionModal";

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
      questions:[

      ]
    }
  },
  mounted() {
    this.init()
  },
  methods:{

    init(){
      axios({
        method: "GET",
        url: `tests/${this.$route.params.test_id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.questions = response.data.data.questions
          }
      )
    },

    async openOAQModal(question, title, action) {

      // if(question !== null) {
      //   question.file = null;
      // }

      const modal = await modalController
          .create({
            component: OAQuestionModal,
            componentProps: {
              title,
              question,
              action,
              test: this.$route.params.test_id,
              stopList: this.questions.map(e => e.text)
            },

          })
      modal.onDidDismiss()
          .then(() => {
                this.init()
              }
          );
      return modal.present();
    },
    async openCAQModal(question, title, action) {

      // if(question !== null) {
      //   question.file = null;
      // }

      const modal = await modalController
          .create({
            component: CAQuestionModal,
            componentProps: {
              title,
              question,
              action,
              test: this.$route.params.test_id,
              stopList: this.questions.map(e => e.text)
            },

          })
      modal.onDidDismiss()
          .then(() => {
                this.init()
              }
          );
      return modal.present();
    },
    edit(question, title, action){


      if(question['correct_answer'] !== null){
        this.openOAQModal(question, title, action )
      } else {
        this.openCAQModal(question, title, action)
      }
    },
    deleteQuestion(questionId){
      axios({
        method: "DELETE",
        url: `questions/${questionId}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          () => {
            console.log('Deleted')
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['deleted_ntf'])
            this.init()
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'],'danger')
          }
      )
    }
  }
}
</script>

<style scoped>


</style>