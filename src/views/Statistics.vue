<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-button @click="$router.back"><ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon></ion-button>
          <ion-button @click="$router.forward"><ion-icon slot="icon-only" name="arrow-forward-outline"></ion-icon></ion-button>
        </ion-buttons>
        <ion-title>{{$root.dict[$root.currentLocale]['statistics_h']}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{$root.dict[$root.currentLocale]['statistics_h']}}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="workspace">
          <ion-segment v-model="selectedType" :value="1">
            <ion-segment-button :value='0'>
              <ion-label >{{$root.dict[$root.currentLocale]['stat_option_0']}}</ion-label>
            </ion-segment-button>
            <ion-segment-button :value='1'>
              <ion-label >{{$root.dict[$root.currentLocale]['stat_option_1']}}</ion-label>
            </ion-segment-button>
            <ion-segment-button :value='2'>
              <ion-label >{{$root.dict[$root.currentLocale]['stat_option_2']}}</ion-label>
            </ion-segment-button>
          </ion-segment>
          <template v-if="selectedType == 0">
            <div class="panel">
              <ion-button
                  size="small"
                  @click="exportData('bot-users')"
              >
               {{$root.dict[$root.currentLocale]['stat_export']}}
              </ion-button>
            </div>
            <div class="scrollable">
               <table>
            <tr>
              <td>
                {{$root.dict[$root.currentLocale]['stat_user_id']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_nick']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_name']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_join_at']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_last_use_at']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_passed']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_avg']}}
              </td>
            </tr>
            <tr v-for="(row, index) in users" :key="index">
              <td >{{row.id}}</td>
              <td >{{row.nick}}</td>
              <td >{{row.name}}</td>
              <td >{{prettyDate(row.join_at)}}</td>
              <td >{{prettyDate(row.last_use_at)}}</td>
              <td >{{row.count}}</td>
              <td >{{prettyPercent(row.avg)}}</td>
            </tr>
            </table>
            </div>
          </template>

          <template v-if="selectedType == 1">
            <div class="panel">
              <ion-button
                  size="small"
                  @click="exportData('dates')"
              >
               {{$root.dict[$root.currentLocale]['stat_export']}}
              </ion-button>
            </div>
            <div class="scrollable">
            <table>
              <tr>
              <td >
                {{$root.dict[$root.currentLocale]['stat_date']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_active']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_new']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_total']}}
              </td>
            </tr>
              <tr v-for="(row, index) in dates" :key="index">
              <td >{{prettyDate(row.date)}}</td>
              <td >{{row.active}}</td>
              <td >{{row.new}}</td>
              <td >{{row.total}}</td>
            </tr>
            </table>
            </div>
          </template>

          <template v-if="selectedType == 2">
            <div class="panel">
              <ion-button
                  size="small"
                  @click="exportData('tests')"
              >
               {{$root.dict[$root.currentLocale]['stat_export']}}
              </ion-button>
            </div>
            <div class="scrollable">
              <table>
              <tr>
              <td>
                {{$root.dict[$root.currentLocale]['stat_categories']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_tests']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_creation_date']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_modification_date']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_publication_date']}}
              </td>
              <td>
                {{$root.dict[$root.currentLocale]['stat_number_of_passes']}}
              </td>
            </tr>
              <tr v-for="(row, index) in tests" :key="index">
              <td ><router-link :to="`/t/categories/${row.category_id}/`">{{row.category_name}}</router-link></td>
              <td ><router-link :to="`/t/tests/${row.id}/`">{{row.name}}</router-link></td>
              <td >{{prettyDate(row.created_at)}}</td>
              <td >{{prettyDate(row.updated_at)}}</td>
              <td >{{prettyDate(row.published_at)}}</td>
              <td >{{row.passed}}</td>
            </tr>
            </table>
            </div>
          </template>

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
} from '@ionic/vue';
import axios from "axios";


export default {
  name: 'Statistics',
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
  },
  data(){
    return {
      users: {},
      dates: {},
      tests: {},
      selectedType: 0

    }
  },
  mounted() {
    this.init()
  },
  methods:{

    init(){
      axios({
        method: "GET",
        url: `statistics/bot-users/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.users = response.data.data
          }
      );
      axios({
        method: "GET",
        url: `statistics/tests/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.tests = response.data.data
          }
      );
      axios({
        method: "GET",
        url: `statistics/dates/`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        }
      }).then(
          response => {
            this.dates = response.data.data
          }
      );
    },
    prettyDate(value){
      if(value === null){
        return null
      }
      const unix = value * 1000;
      const d = new Date(unix)

      return new Intl.DateTimeFormat(this.$root.currentLocale).format(d);
    },
    prettyPercent(value){
      return `${Math.round(value * 100) / 100}`
    },
    exportData(entities){
      axios({
        method: "GET",
        url: `statistics/${entities}/?export=xlsx&lang=${this.$root.currentLocale}`,
        headers: {
          "Authorization": `Token ${localStorage.getItem('token') || ''}`
        },
        responseType: 'blob',
      }).then(
          response => {
           const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            const fileLink = document.createElement('a');

            fileLink.href = fileURL;

            fileLink.setAttribute('download', 'file.xlsx');

            document.body.appendChild(fileLink);
            fileLink.click();
          }
      );
    }
  }
}
</script>

<style scoped>

table tr:first-child td{
  color: #4782ff;
}

table tr:nth-child(even) {background: #ddeeff}

td{
  padding: 12px;
  width: 200px;
  color: black;
}

</style>