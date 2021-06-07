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
      <ion-label >{{$root.dict[$root.currentLocale]['level_h']}}</ion-label>
      <ion-select
          :value="affectedPhase.level_id"
          v-on:ionChange="optionChanged"
          :ok-text="$root.dict[$root.currentLocale]['ok_btn']"
          :cancel-text="$root.dict[$root.currentLocale]['cancel_btn']"
      >
        <ion-select-option
            v-for="level in levels"
            :key="level.id" :value="level.id"

        >
          {{level.name}}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label position="stacked" >{{$root.dict[$root.currentLocale]['name_lbl']}}</ion-label>
      <ion-input v-model="affectedPhase.name"></ion-input>
    </ion-item>
    <ion-item v-if="$root.$data.user !== null && $root.$data.user.bot.id === 0"  class="check-item">
      <ion-checkbox v-model="affectedPhase.sis">

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
  IonCheckbox
} from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from "axios";


export default defineComponent({
  name: 'PhaseModal',
  props: [ 'phase','title', 'action', 'level', 'stopList'],
  data() {
    return {
      levels: [],
      affectedPhase: {
        id:null,
        name: '',
        sis: true
      }
    }
  },
  created() {
    axios({
      method: "GET",
      url: 'levels/',
      headers: {
        "Authorization": `Token ${localStorage.getItem('token') || ''}`
      }
    }).then(
        response => {
          this.levels = response.data.data
        }
    )
    if(this.phase !== null){
      this.affectedPhase = {...this.phase, 'level_id': +this.level};

    }
  },
  methods: {
    dismissModal(data) {
      modalController.dismiss(data);
    },
    save() {
      if (this.affectedPhase.name === '') {
        alert(this.$root.dict[this.$root.currentLocale]['enter_name'])
      }

      if ((this.phase === null || this.affectedPhase.name !== this.phase.name) && this.stopList.includes(this.affectedPhase.name)) {
        alert(this.$root.dict[this.$root.currentLocale]['duplicated_name'])
        return
      }

      axios(this.affectedPhase.id === null ? {
        method: 'POST',
        url: `levels/${this.affectedPhase['level_id']}/phases/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedPhase.name,
          sis: this.affectedPhase.sis
        },
      } : {
        method: 'PUT',
        url: `phases/${this.affectedPhase.id}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        data: {
          name: this.affectedPhase.name,
          'level_id': this.affectedPhase.level_id,
          sis: this.affectedPhase.sis
        }
      }).then(
          (response) => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
            this.dismissModal(
                {
                  id: this.affectedPhase.id !== null ? this.affectedPhase.id : response.data.data.id,
                  name: this.affectedPhase.name,
                  isNew: this.affectedPhase.id === null
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
      this.affectedPhase['level_id'] = event.target.value
    },
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem,IonLabel,IonSelect, IonSelectOption, IonCheckbox }
});
</script>

<style scoped>

</style>