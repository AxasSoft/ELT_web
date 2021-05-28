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
          <div class="panel">
            <ion-button size="small" @click="openModal(null, $root.dict[$root.currentLocale]['level_h'], $root.dict[$root.currentLocale]['save'])">
              {{$root.dict[$root.currentLocale]['add_level_btn']}}
            </ion-button>
            <ion-button size="small" @click="toggleReorder">
              {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
            </ion-button>
          </div>
          <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">
            <ion-item v-for="level in levels" :key="level.id">
              <ion-label>{{level.name}}</ion-label>
              <ion-button slot="end" :href="'/k/kb/'+level.id">{{$root.dict[$root.currentLocale]['phases_lbl']}}</ion-button>
              <ion-button slot="end" @click="openModal(level,$root.dict[$root.currentLocale]['level_h'],$root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
              <ion-button color="danger" slot="end" @click="deleteLevel(level.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
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
  IonIcon,
  IonReorder,
  IonReorderGroup
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
    IonIcon,
    IonReorder,
    IonReorderGroup
  },
  data(){
    return {
      levels:[
      ],
      reorder: false
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      axios({
        method: "GET",
        url: `courses/${this.$route.params.course_id}/levels/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.levels = response.data.data
          }
      )
    },
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
          .then(() => {
            this.init()
          }
          );

      return modal.present();
    },
    deleteLevel(levelId){

      if(!confirm(this.$root.dict[this.$root.currentLocale]['delete_q'])){
        return
      }

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
    },
    doReorder(event) {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete');

      this.levels = event.detail.complete(this.levels);

      // After complete is called the items will be in the new order
      console.log('After complete');
    },
    toggleReorder(){
      this.reorder = !this.reorder;
      if(!this.reorder){
        console.log('Saved');
        axios({
              method: 'POST',
              url: `levels/order/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
              data: {
                'order':this.levels.map(value => value.id)
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