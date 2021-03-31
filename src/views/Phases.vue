<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{levels[$route.params.level_id]}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{levels[$route.params.level_id]}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <div class="panel">
            <ion-button
                size="small"
                @click="openModal(null,$root.dict[$root.currentLocale]['phase_h'], $root.dict[$root.currentLocale]['save'], $route.params.level_id)"
            >
              {{$root.dict[$root.currentLocale]['add_phase_btn']}}
            </ion-button>
            <ion-button size="small" @click="toggleReorder">
              {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
            </ion-button>
          </div>
          <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">
            <ion-item v-for="phase in phases" :key="phase.id">
              <ion-label>{{phase.name}}</ion-label>
              <ion-button slot="end" :href="'/k/phases/'+phase.id">{{$root.dict[$root.currentLocale]['lessons_lbl']}}</ion-button>
              <ion-button
                  slot="end"
                  @click="openModal(phase,$root.dict[$root.currentLocale]['phase_h'], $root.dict[$root.currentLocale]['save'], $route.params.level_id)"
              >
                {{$root.dict[$root.currentLocale]['edit']}}
              </ion-button>
              <ion-button color="danger" slot="end" @click="deletePhase(phase.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
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
  modalController
} from '@ionic/vue';
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
    IonToolbar
  },
  data(){
    return {
      levels:{

      },
      phases:[
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
        url: 'levels/',
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            for(const level of response.data.data){
              this.levels[level.id] = level.name
            }
          }
      );
      axios({
        method: "GET",
        url: `levels/${this.$route.params.level_id}/phases/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.phases = response.data.data
          }
      )
    },
    async openModal(phase, title, action, level) {

      const modal = await modalController
          .create({
            component: PhaseModal,
            componentProps: {
              title,
              level,
              action,
              phase,
              stopList: this.phases.map(e => e.name)
            },

          })

      modal.onDidDismiss()
          .then(() => {
            this.init();
              }
          );

      return modal.present();
    },
    deletePhase(phaseId){
      axios({
        method: "DELETE",
        url: `phases/${phaseId}/`,
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
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    },
    doReorder(event) {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete');

      this.phases = event.detail.complete(this.phases);

      // After complete is called the items will be in the new order
      console.log('After complete');
    },
    toggleReorder(){
      this.reorder = !this.reorder;
      if(!this.reorder){
        console.log('Saved');
        axios({
              method: 'POST',
              url: `phases/order/`,
              headers: {
                "Authorization": `Token ${localStorage.getItem('token') || ''}`
              },
              data: {
                'order':this.phases.map(value => value.id)
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