<template>
  <IonApp>
    <IonSplitPane  when="(min-width: 920px)" content-id="main-content">
      <ion-menu  :class="{noDisplay: isLoginPage}"  content-id="main-content" type="overlay">
        <ion-content >
          <ion-list id="inbox-list">
            <ion-list-header>
              ELT Bot
              <ion-button @click="changeLocale">
                {{currentLocale}}
              </ion-button>
            </ion-list-header>
            <ion-buttons>{{user?user.name:''}}

              <ion-button href="/login">{{dict[currentLocale]['logout']}}</ion-button>
            </ion-buttons>


            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item v-if="!p.forOnlyAdmin || (user !== null && user.is_admin)" @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ dict[currentLocale][p.title] }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
          <ion-buttons>

          </ion-buttons>
        </ion-content>

      </ion-menu>

      <ion-router-outlet ref="routerview" id="main-content"></ion-router-outlet>
    </IonSplitPane>
  </IonApp>
</template>

<script>
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane, toastController } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import {bookmarkOutline, bookmarkSharp, heartOutline, heartSharp, peopleOutline, peopleSharp, warningOutline, warningSharp, serverOutline, serverSharp, checkboxOutline, checkboxSharp, callOutline, callSharp, analyticsOutline, analyticsSharp } from 'ionicons/icons';
import axios from 'axios';
import router from "@/router";
import {dict} from '@/./dict.js'
import { addIcons } from "ionicons";
import { arrowForwardOutline, arrowBackOutline } from "ionicons/icons";

addIcons({
  "arrow-forward-outline": arrowForwardOutline,
  "arrow-back-outline": arrowBackOutline,
});

//axios.defaults.baseURL = 'http://localhost:5000/cp/';
axios.defaults.baseURL = 'http://188.166.238.36:5000/cp/';
axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
      ) {
        router.push('/login')

      } else if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 404
      ) {
        router.replace('/404')

      }
      else {
        return Promise.reject(error)
      }

    }
);


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane,
  },
  setup() {
    const selectedIndex = ref(0);

    const appPages = [
      {
        section: 'u',
        title: 'users_mi',
        url: '/u/users',
        iosIcon: peopleOutline,
        mdIcon: peopleSharp,
        forOnlyAdmin: true
      },
      {
        section: 'k',
        title: 'kb_mi',
        url: '/k/kb',
        iosIcon: serverOutline,
        mdIcon: serverSharp,
        forOnlyAdmin: true
      },
      {
        section: 't',
        title: 'tests_mi',
        url: '/t/categories',
        iosIcon: checkboxOutline,
        mdIcon: checkboxSharp,
        forOnlyAdmin: false
      },
      {
        section: 'c',
        title: 'contacts_mi',
        url: '/c/contacts',
        iosIcon: callOutline,
        mdIcon: callSharp,
        forOnlyAdmin: true
      },
      {
        section: 's',
        title: 'statistics_mi',
        url: '/s/statistics',
        iosIcon: analyticsOutline,
        mdIcon: analyticsSharp,
        forOnlyAdmin: true
      }
    ];

    const path = window.location.pathname;
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(page => path.toLowerCase().startsWith('/'+page.section.toLowerCase()+'/'));
    }

    const route = useRoute();

    return {
      selectedIndex,
      appPages,
      dict,
      bookmarkOutline,
      bookmarkSharp,
      heartOutline,
      heartSharp,
      peopleOutline,
      peopleSharp,
      checkboxOutline,
      checkboxSharp,
      warningOutline,
      warningSharp,
      serverSharp,
      serverOutline,
      isSelected: (url) => url === route.path ? 'selected' : ''
    }
  },
  data(){
    return {
      user: null,
      currentLocale: 'en'
    }
  },
  mounted() {
    this.currentLocale = localStorage.getItem('locale') || 'en'

    const token = localStorage.getItem('token') || '';
    if(token === ''){
      router.push('/login')
    }
    axios(
        {
          method: "GET",
          url: 'users/self/',
          headers: {
            "Authorization": 'Token '+token
          }
        }
    ).then(
        response => {
          this.user = response.data.data
        }
    ).catch(
        (error) => {
          router.push('/login')
        }
    )
  },
  computed:{
    isLoginPage(){
      return this.$route.name === 'Login'
    }
  },
  methods:{
    async notify(message,color="dark"){
      const toast = await toastController
          .create({
            message: message,
            duration: 2000,
            color
          })
      return toast.present();
    },
    changeLocale(){
      if(this.currentLocale === 'en'){
        this.currentLocale = 'ru';
      }
      else if(this.currentLocale === 'ru'){
        this.currentLocale = 'en';
      }
      else {
        this.currentLocale = 'en'
      }
      localStorage.setItem('locale', this.currentLocale)
      this.$forceUpdate();
    }
  },
  watch:{
    $route(){
      const path = window.location.pathname;
      if (path !== undefined) {
        this.selectedIndex = this.appPages.findIndex(page => path.toLowerCase().startsWith('/' + page.section.toLowerCase() + '/'));
      }
    }
  }
});
</script>

<style scoped>
</style>