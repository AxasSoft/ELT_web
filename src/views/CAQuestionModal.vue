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
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['text_lbl']}}</ion-label>
      <ion-input v-model="affectedQuestion.text"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{$root.dict[$root.currentLocale]['file_lbl']}}</ion-label>
      <ion-input type="file" accept="image/*, audio/*" @change="changeListener" v-model="affectedQuestion.file"></ion-input>
    </ion-item>

    <template v-if="link !== null">
      <ion-item>
        <a :href="link"  target="_blank">{{link}}</a>
      </ion-item>

        <ion-button @click="deleteFile">{{$root.dict[$root.currentLocale]['detach_file']}}</ion-button>

    </template>

    <ion-item v-if="affectedQuestion.id !== null">
      <table>


        <tr>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_text_h']}}</ion-label></td>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_correct_h']}}</ion-label></td>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_actions_h']}}</ion-label></td>
        </tr>
        <tr v-for="answer in affectedQuestion.answers" :key="answer.id">
          <template v-if="answer.editing">
            <td><ion-item><ion-input v-model="answer.text"></ion-input></ion-item></td>
            <td><ion-item><ion-checkbox v-model="answer.is_correct"></ion-checkbox></ion-item></td>
            <td><ion-button @click="editAnswer(answer)">{{$root.dict[$root.currentLocale]['save']}}</ion-button></td>
          </template>
          <template v-else>
            <td><ion-label>{{answer.text}}</ion-label></td>
            <td><ion-label>{{answer.is_correct? $root.dict[$root.currentLocale]['yes_option']: $root.dict[$root.currentLocale]['no_option']}}</ion-label></td>
            <td>
              <ion-button  @click="answer.editing = true">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button  color="danger" @click="deleteAnswer(answer.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
            </td>
          </template>
        </tr>
        <tr>
          <td><ion-item><ion-input v-model="newAnswer.text"></ion-input></ion-item></td>
          <td><ion-item><ion-checkbox v-model="newAnswer.is_correct"></ion-checkbox></ion-item></td>
          <td><ion-button @click="addAnswer">{{$root.dict[$root.currentLocale]['add_answer_btn']}}</ion-button></td>
        </tr>

      </table>
    </ion-item>
    <ion-item v-else>
      <table>


        <tr>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_text_h']}}</ion-label></td>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_correct_h']}}</ion-label></td>
          <td><ion-label>{{$root.dict[$root.currentLocale]['answers_actions_h']}}</ion-label></td>
        </tr>
        <tr v-for="answer in tempAnswers" :key="answer.id">
          <template v-if="answer.editing">
            <td><ion-item><ion-input v-model="answer.text"></ion-input></ion-item></td>
            <td><ion-item><ion-checkbox v-model="answer.is_correct"></ion-checkbox></ion-item></td>
            <td><ion-button @click="answer.editing = false">{{$root.dict[$root.currentLocale]['save']}}</ion-button></td>
          </template>
          <template v-else>
            <td><ion-label>{{answer.text}}</ion-label></td>
            <td><ion-label>{{answer.is_correct? $root.dict[$root.currentLocale]['yes_option']: $root.dict[$root.currentLocale]['no_option']}}</ion-label></td>
            <td>
              <ion-button  @click="answer.editing = true">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button  color="danger" @click="deleteAnswer(answer.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
            </td>
          </template>
        </tr>
        <tr>
          <td><ion-item><ion-input v-model="newAnswer.text"></ion-input></ion-item></td>
          <td><ion-item><ion-checkbox v-model="newAnswer.is_correct"></ion-checkbox></ion-item></td>
          <td><ion-button @click="addAnswer">{{$root.dict[$root.currentLocale]['add_answer_btn']}}</ion-button></td>
        </tr>

      </table>
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
    IonCheckbox,
    IonButtons,
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
        answers: [],
        'test_id': +this.test
      },
      newAnswer:{
        text: '',
        'is_correct': false
      },
      tempAnswers: [],
      link: null,
      tests:[],
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
    this.affectedQuestion.answers = this.affectedQuestion.answers.map(it => {return {...it, editing: false}})

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
      if((this.affectedQuestion.id === null?this.tempAnswers:this.affectedQuestion.answers).length === 0){
        alert(this.$root.dict[this.$root.currentLocale]['add_answer'])
        return
      }

      /*
      if((this.question === null || this.affectedQuestion.text !== this.affectedQuestion.text) && this.stopList.includes(this.affectedQuestion.text)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_text'])
        return
      }*/

      const formData = new FormData();
      formData.append('text', this.affectedQuestion.text);
      if(this.affectedQuestion.file !== null) {
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
          (response) => {

            const answers = []



            const questionId = response.data.data.id;
            const questionFile = response.data.data.file;

            const answersPromises = this.tempAnswers.map(
                t => axios(
                    {
                      method: "POST",
                      url: `questions/${questionId}/answers/`,
                      headers: {
                        "Authorization": `Token ${localStorage.getItem('token') || ''}`
                      },
                      data: {
                        text: t.text,
                        'is_correct': t.is_correct
                      }
                    }
                ).then(
                    response => {
                      answers.push(
                          {
                            ...t,
                            id: response.data.data.id,
                          }
                      )
                    }
                )
            )



            Promise.all(answersPromises).then(
                () => {
                  this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
                }
            ).catch(
                error => {
                  console.error(error);
                  this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
                }
            ).finally(
                () => {
                  this.dismissModal(
                      {
                        id: questionId,
                        text: this.affectedQuestion.text,
                        file: questionFile,
                        answers: answers,
                        isNew: this.affectedQuestion.id === null
                      }
                  )
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
    addAnswer(){

      const texts = this.tempAnswers.map(t => t.text)
      texts.push(this.affectedQuestion.answers.map(t => t.text))

      if(texts.includes(this.newAnswer.text)){
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_text'])
        return
      }

      if(this.affectedQuestion.id === null){
        this.tempAnswers = [
            ...this.tempAnswers,
          {
            id: 'temp-'+this.tempAnswers.length,
            text: this.newAnswer.text,
            'is_correct': this.newAnswer.is_correct,
            'editing': false
          }
        ]
        this.newAnswer = {
          text: '',
          'is_correct': false
        }
      }
      else {
        axios(
            {
              method: "POST",
              url: `questions/${this.affectedQuestion.id}/answers/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
              data: {
                text: this.newAnswer.text,
                'is_correct': this.newAnswer.is_correct
              }
            }
        ).then(
            response => {
              this.affectedQuestion.answers = [
                ...this.affectedQuestion.answers,
                {
                  id: response.data.data.id,
                  ...this.newAnswer
                }
              ]
              this.newAnswer = {
                text: '',
                'is_correct': false
              }
            }
        )
      }
    },
    deleteAnswer(answerId) {
      if (this.affectedQuestion.id === null) {
        this.tempAnswers = this.tempAnswers.filter(answer => answer.id !== answerId)
      } else {
        axios(
            {
              method: "DELETE",
              url: `answers/${answerId}/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
            }
        ).then(
            () => {
              this.affectedQuestion.answers = this.affectedQuestion.answers.filter(answer => answer.id !== answerId)
            }
        )
      }
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
    editAnswer(answer){
      axios(
          {
            method: "PUT",
            url: `answers/${answer.id}/`,
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            },
            data: {
              text: answer.text,
              'is_correct': answer.is_correct
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
      answer.editing = false
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel, IonCheckbox, IonButtons, IonSelect, IonSelectOption }
});
</script>

<style scoped>

</style>