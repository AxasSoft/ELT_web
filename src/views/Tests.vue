<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button color="primary"></ion-menu-button>
            <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
            <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline" @click="forward"></ion-icon></ion-button>
          </ion-buttons>
          <ion-title>{{$root.dict[$root.currentLocale]['tests_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">{{$root.dict[$root.currentLocale]['tests_h']}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <div id="container">
          <div class="workspace">
            <div class="panel">
              <ion-button
                  size="small"
                  @click="openModal(null,$root.dict[$root.currentLocale]['test_h'] ,$root.dict[$root.currentLocale]['save'])"
              >
                {{$root.dict[$root.currentLocale]['add_test_btn']}}
              </ion-button>
              <ion-button size="small" @click="toggleReorder">
                {{reorder? $root.dict[$root.currentLocale]['save_order']:$root.dict[$root.currentLocale]['change_order'] }}
              </ion-button>
            </div>
            <ion-segment v-model="selectedType" :value="-1">
              <ion-segment-button :value='-1'>
                <ion-label>{{$root.dict[$root.currentLocale]['option_all']}}</ion-label>
              </ion-segment-button>
              <ion-segment-button :value='0'>
                <ion-label>{{$root.dict[$root.currentLocale]['option_0']}}</ion-label>
              </ion-segment-button>
              <ion-segment-button :value='1'>
                <ion-label>{{$root.dict[$root.currentLocale]['option_1']}}</ion-label>
              </ion-segment-button>
              <ion-segment-button :value='2'>
                <ion-label>{{$root.dict[$root.currentLocale]['option_2']}}</ion-label>
              </ion-segment-button>
              <ion-segment-button :value='3'>
                <ion-label>{{$root.dict[$root.currentLocale]['option_3']}}</ion-label>
              </ion-segment-button>
            </ion-segment>
            <ion-reorder-group @ionItemReorder="doReorder($event)" :disabled="!reorder">

              <ion-item v-for="test in filteredTests" :key="test.id">
                <ion-label>{{test.name}}</ion-label>
                <ion-button v-if="$root.user !== null && $root.user.is_admin || [0,3].includes(test.type)" slot="end" :href="'/t/tests/'+test.id">{{$root.dict[$root.currentLocale]['questions_lbl']}}</ion-button>
                <ion-button
                    slot="end"
                    v-if="$root.user !== null && $root.user.is_admin || [0,3].includes(test.type)"
                    @click="openModal(test,$root.dict[$root.currentLocale]['test_h'] ,$root.dict[$root.currentLocale]['save'])"
                >
                  {{$root.dict[$root.currentLocale]['edit']}}
                </ion-button>
                <ion-button slot="end" v-if="test.type == 0" @click="changeStatus(test.id,1)">{{$root.dict[$root.currentLocale]['change_qs_1_btn']}}</ion-button>
                <ion-button slot="end" v-if="$root.user !== null && $root.user.is_admin && test.type == 1" @click="changeStatus(test.id,2)">{{$root.dict[$root.currentLocale]['change_qs_2_btn']}}</ion-button>
                <ion-button slot="end" v-if="$root.user !== null && $root.user.is_admin && test.type == 1"  @click="changeStatus(test.id,3)">{{$root.dict[$root.currentLocale]['change_qs_3_btn']}}</ion-button>
                <ion-button
                    color="danger"
                    v-if="$root.user !== null && $root.user.is_admin || [0,3].includes(test.type)"
                    slot="end"
                    @click="deleteTest(test.id)"
                >
                  {{$root.dict[$root.currentLocale]['delete']}}
                </ion-button>
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
  IonSegment,
  IonSegmentButton,
  IonItem,
  IonLabel,
  IonButton,
  modalController,
  IonReorder,
  IonReorderGroup
} from '@ionic/vue';
    import axios from "axios";
import TestModal from "@/views/TestModal";
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
        IonSegment,
        IonSegmentButton,
        IonItem,
        IonLabel,
        IonButton,
        IonReorder,
        IonReorderGroup
      },
      data(){
        return {
          selectedType: -1,
          tests:[],
          reorder: false,
        }
      },
      computed:{
        filteredTests(){
          if(this.selectedType == -1){
            return this.tests
          }
            return this.tests.filter(test => test.type == this.selectedType)
        }
      },
      mounted(){
        this.init()
      },
      methods: {
        init(){
          axios({
            method: "GET",
            url: `categories/${this.$route.params.category_id}/tests/?timestamp=${new Date().getTime()}`,
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            }
          }).then(
              response => {
                this.tests = response.data.data
              }
          )
        },
        changeStatus(testId,status){
          axios({
            method: "PUT",
            url: `tests/${testId}/`,
            headers: {
              "Authorization": `Token ${localStorage.getItem('token') || ''}`
            },
            data: {
              status
            }
          }).then(
              () => {
                    console.log('Changed')
                    this.$root.notify(this.$root.dict[this.$root.currentLocale]['changed_ntf'])
                   this.init();
              }
          ).catch(
              error => {
                console.error(error);
                this.$root.notify(this.$root.dict[this.$root.currentLocale]['error_ntf'])
              }
          )
        },
        async openModal(test, title, action) {

          const modal = await modalController
              .create({
                component: TestModal,
                componentProps: {
                  title,
                  test,
                  action,
                  category: this.$route.params.category_id,
                  stopList: this.tests.map(e => e.name)
                },

              })
          modal.onDidDismiss()
              .then(() => {
                    this.init()
                  }
              );
          return modal.present();
        },
        deleteTest(testId){

          if(!confirm(this.$root.dict[this.$root.currentLocale]['delete_q'])){
            return
          }


          axios({
            method: "DELETE",
            url: `tests/${testId}/`,
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
        },
        doReorder(event) {
          // Before complete is called with the items they will remain in the
          // order before the drag
          console.log('Before complete');

          this.tests = event.detail.complete(this.tests);

          // After complete is called the items will be in the new order
          console.log('After complete');
        },
        toggleReorder(){
          this.reorder = !this.reorder;
          if(!this.reorder){
            console.log('Saved');
            axios({
                  method: 'POST',
                  url: `tests/order/`,
                  headers: {
                    "Authorization": `Token ${localStorage.getItem('token') || ''}`
                  },
                  data: {
                    'order':this.tests.map(value => value.id)
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
    )
  </script>


<style scoped>


</style>