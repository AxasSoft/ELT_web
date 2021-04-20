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
      <ion-label >{{$root.dict[$root.currentLocale]['test_h']}}</ion-label>
      <ion-select
          :value="affectedQuestion.test_id"
          v-on:ionChange="optionChanged"
          :ok-text="$root.dict[$root.currentLocale]['ok_btn']"
          :cancel-text="$root.dict[$root.currentLocale]['cancel_btn']"
      >
        <ion-select-option
            v-for="test in tests"
            :key="test.id" :value="test.id"

        >
          {{test.name}}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['description_lbl']}}</ion-label>
      <ion-input v-model="affectedQuestion.description"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['text_lbl']}}</ion-label>
      <ion-input v-model="affectedQuestion.text"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['file_lbl']}}</ion-label>
      <ion-input type="file" accept="image/*, audio/*" @change="changeListener" v-model="affectedQuestion.file"></ion-input>
    </ion-item>

    <template v-if="link !== null">

      <ion-item >
        <a :href="link" target="_blank">{{link}}</a>
      </ion-item>

        <ion-button @click="deleteFile">{{$root.dict[$root.currentLocale]['detach_file']}}</ion-button>


    </template>

    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['url_lbl']}}</ion-label>
      <ion-input v-model="affectedQuestion.url"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['correct_answer_lbl']}}</ion-label>
      <ion-input v-model="affectedQuestion.correct_answer"></ion-input>
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
    IonSelectOption
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'QuestionModal',
  props: [ 'question','title','action', 'test', 'stopList'],
  data() {
    return {
      affectedQuestion: {
        id:null,
        text: '',
        file: null,
        'correct_answer': '',
        'test_id': this.test,
        url: '',
        description: ''
      },
      link: null,
      tests:[]
    }
  },
  mounted() {
    axios({
      method: "GET",
      url: 'tests/',
      headers: {
        "Authorization": `Token ${localStorage.getItem('token') || ''}`
      }
    }).then(
        response => {
          this.tests = response.data.data
        }
    )
    if(this.question !== null){
      this.affectedQuestion = {...this.question, 'test_id': +this.test}
      this.link = this.question.file
    }
    this.affectedQuestion.file = null
  },
  methods:{
    dismissModal(data) {
      modalController.dismiss(data);
    },
    changeListener($event)  {
      this.affectedQuestion.file = $event.target.files[0];
    },
    save(){
      if(this.affectedQuestion.text === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_text'])
        return
      }
      if(this.affectedQuestion['correct_answer'] === ''){
        alert(this.$root.dict[this.$root.currentLocale]['enter_correct_answer'])
        return
      }
      /*
      if((this.question === null || this.affectedQuestion.text !== this.affectedQuestion.text) && this.stopList.includes(this.affectedQuestion.text)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_text'])
        return
      }*/

      const formData = new FormData();
      formData.append('text', this.affectedQuestion.text);
      formData.append('url', this.affectedQuestion.url)
      formData.append('description', this.affectedQuestion.description)
      if(this.affectedQuestion.file !== null && this.affectedQuestion.file instanceof Blob) {
        formData.append('file', this.affectedQuestion.file, this.affectedQuestion.file.name);
      }
      if(this.affectedQuestion.id !== null){
        formData.append('test_id', this.affectedQuestion['test_id'])
      }


      axios(this.affectedQuestion.id === null? {
        method: 'POST',
        url: `tests/${this.affectedQuestion['test_id']}/questions/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: formData
      }:{
        method: 'PUT',
        url: `questions/${this.affectedQuestion.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: formData
      }).then(
          response => {
            const questionId = response.data.data.id;
            const questionFile = response.data.data.file;
            axios(
                {
                  method: "PUT",
                  url: `/questions/${questionId}/correct_answer/`,
                  headers: {
                    "Authorization": `Token ${localStorage.getItem('token') || ''}`
                  },
                  data:{
                    text: this.affectedQuestion.correct_answer
                  }
                }
            ).then(
                () => {

                  const data = {
                    id: questionId,
                    text: this.affectedQuestion.text,
                    file: questionFile,
                    correctAnswer: this.affectedQuestion.correct_answer,
                    isNew: this.affectedQuestion.id === null
                  }

                  console.log('Saved');
                  this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
                  this.dismissModal(
                      data
                  );
                }
            ).catch(
                error => {
                  console.error(error);
                  this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
                }
            )
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )

    },
    deleteFile(){
      axios({
        method: "DELETE",
        url: `questions/${this.affectedQuestion.id}/file/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          () => {
            console.log('Deleted')
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['deleted_ntf'])
            this.link = null
          }
      ).catch(
          error => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'],'danger')
          }
      )
    },
    optionChanged(event) {
      this.affectedQuestion['test_id'] = event.target.value
    },
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel, IonSelect, IonSelectOption }
});
</script>

<style scoped>

</style>