<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{ $root.dict[$root.currentLocale]['categories_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $root.dict[$root.currentLocale]['categories_h'] }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">

          <div v-if="$root.user !== null && $root.user.is_admin" class="panel">
            <ion-button size="small" @click="openModal(null,$root.dict[$root.currentLocale]['category_h'], $root.dict[$root.currentLocale]['save'])">
              {{$root.dict[$root.currentLocale]['add_category']}}
            </ion-button>
            <ion-button size="small" @click="toggleReorder">
              {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
            </ion-button>
          </div>
          <div class="scrollable">
          <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">

            <ion-item v-for="category in categories" :key="category.id">
              <ion-label>{{category.name}}</ion-label>
              <ion-button slot="end" :href="'/t/categories/'+category.id">{{$root.dict[$root.currentLocale]['tests_lbl']}}</ion-button>
              <template v-if="$root.user !== null && $root.user.is_admin">
                <ion-button slot="end" @click="openModal(category, $root.dict[$root.currentLocale]['category_h'], $root.dict[$root.currentLocale]['save'])">{{$root.dict[$root.currentLocale]['edit']}}</ion-button>
                <ion-button color="danger" slot="end" @click="deleteCategory(category.id)">{{$root.dict[$root.currentLocale]['delete']}}</ion-button>
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
  modalController,
  IonReorder,
  IonReorderGroup
} from '@ionic/vue';
import axios from "axios";
import CategoryModal from "@/views/CategoryModal";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Folder',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonReorder,
    IonReorderGroup
  },
  data(){
    return {
      categories:[],
      reorder: false,
    }
  },
  mounted(){

    this.init()

  },
  methods:{
    init(){
      axios({
        method: "GET",
        url: `courses/${this.$route.params.course_id}/categories/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.categories = response.data.data

          }
      )
    },
    async openModal(category, title, action) {
      const modal = await modalController
          .create({
            component: CategoryModal,
            componentProps: {
              title,
              category,
              action,
              stopList: this.categories.map(e => e.name)
            },
          })
      modal.onDidDismiss()
          .then(() => {
                this.init()
              }
          );
      return modal.present();
    },
    deleteCategory(categoryId){

      if(!confirm(this.$root.dict[this.$root.currentLocale]['delete_q'])){
        return
      }

      axios({
        method: "DELETE",
        url: `categories/${categoryId}/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          () => {
            this.categories = this.categories.filter(category => category.id !== categoryId);
            console.log('Deleted')
            this.init()
          }
      ).catch(
          (error) => {
            console.error(error)
            this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
          }
      )
    },
    doReorder(event) {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete');

      this.categories = event.detail.complete(this.categories);

      // After complete is called the items will be in the new order
      console.log('After complete');
    },
    toggleReorder(){
      this.reorder = !this.reorder;
      if(!this.reorder){
        console.log('Saved');
        axios({
          method: 'POST',
          url: `categories/order/`,
          headers: {
            "Authorization": `Token ${localStorage.getItem('token') || ''}`
          },
          data: {
            'order':this.categories.map(value => value.id)
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
})
</script>

<style scoped>


</style>