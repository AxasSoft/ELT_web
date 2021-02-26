<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>
          {{$root.dict[$root.currentLocale]['kb_h']}}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>

          <ion-title size="large">{{$root.dict[$root.currentLocale]['kb_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="panel"><ion-button size="small" @click="openModal(null, $root.dict[$root.currentLocale]['level_h'], $root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['add_level_btn']}}</ion-button></div>
          <ion-list>
            <ion-item v-for="level in levels" :key="level.id">
              <ion-label>{{level.name}}</ion-label>
              <ion-button slot="end" :href="'/k/kb/'+level.id">{{$root.dict[$root.currentLocale]['phases_lbl']}}</ion-button>
              <ion-button slot="end" @click="openModal(level,$root.dict[$root.currentLocale]['level_h'],$root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button color="danger" slot="end" @click="deleteLevel(level.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
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
  modalController,
  IonIcon
} from '@ionic/vue';
import axios from "axios";

import LevelModal from "@/views/LevelModal";

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
    IonIcon
  },
  data(){
    return {
      levels:[
      ]
    }
  },
  mounted() {

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
  },
  methods:{
    async openModal(level, title, action) {
      const modal = await modalController
          .create({
            component: LevelModal,
            componentProps: {
              title,
              level,
              action,
              stopList: this.levels.map(e => e.name)
            },

          })

      modal.onDidDismiss()
          .then((data) => {
            if(data.data !== undefined){
              const isNew = data.data.isNew
              if(isNew){
                this.levels.push(
                    {
                      id: data.data.id, name: data.data.name
                    }
                )
              } else {

                this.levels = this.levels.map(
                    level => level.id === data.data.id?
                        { id: data.data.id, name: data.data.name}
                        : level
                )

              }
            }
          }
          );

      return modal.present();
    },
    deleteLevel(levelId){
      axios({
        method: "DELETE",
        url: `levels/${levelId}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          () => {
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['deleted_ntf'])
            this.levels = this.levels.filter(level => level.id !== levelId)
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