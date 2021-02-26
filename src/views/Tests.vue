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
            <ion-list>
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
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton, modalController
} from '@ionic/vue';
    import axios from "axios";
import TestModal from "@/views/TestModal";

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
        IonSegment,
        IonSegmentButton,
        IonList,
        IonItem,
        IonLabel,
        IonButton
      },
      data(){
        return {
          selectedType: -1,
          tests:[]
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
            url: `categories/${this.$route.params.category_id}/tests/`,
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
        }
      }
    }
  </script>


<style scoped>


</style>