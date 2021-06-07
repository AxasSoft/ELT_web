<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{ $root.dict[$root.currentLocale]['settings_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $root.dict[$root.currentLocale]['settings_h'] }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="scrollable">
          <section v-for="group in settings" :key="group.id">
            <h1>{{$root.currentLocale == "en"?group.name_en:group.name_ru}}</h1>
            <ion-item v-for="setting in group.settings" :key="setting.id">
              <ion-label position="stacked">{{$root.currentLocale == "en"?setting.name_en:setting.name_ru}}</ion-label>
              <ion-input v-model="setting.value"></ion-input>
            </ion-item>
          </section>
          <ion-button @click="save">{{$root.dict[$root.currentLocale]['save']}}</ion-button>
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
    IonItem,
    IonLabel,
    IonInput,
} from '@ionic/vue';

import axios from "axios";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Settings',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
  },
  data(){
    return {
      settings: null
    }
  },
  mounted(){

    this.init()

  },
  methods: {
    init() {
      axios({
        method: "GET",
        url: `settings/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.settings = response.data.data
          }
      )
    },
    save(){
      Promise.all(
          this.settings
              .reduce((prev,next)=>[...prev,...next.settings],[])
              .map(
                  item => axios(
                    {
                      method: "PUT",
                      url: `settings/${item.id}/`,
                      headers: {
                        "Authorization": `Token ${localStorage.getItem('token') || ''}`
                      },
                      data: {
                        value: item.value
                      },
                    }
                  )
              )
      ).then(
          () => {
            console.log('Saved');
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['saved_ntf'])
          }
      ).catch(
          (error) => {
            console.error(error);
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    }
  }
}
)
</script>

<style scoped>


</style>