<template>
  <div class="main-view">

    <!-- Loading animation -->
    <spinner/>
    <feedback-toast/>

    <!-- Bottom Navigation Bar -->
    <div class="nav-bar panel-btns"></div>

    <coral-wizardview>
      
      <!-- TODO: #3 Create components instead of writing everything in here as pure html -->
      <!-- Steps -->
      <step-list/>

      <!-- Content views -->
      <coral-panelstack coral-wizardview-panelstack="" class="">

        <!-- Content view 1 -->
        <panel-api/>
        
        <!-- Content view 2 -->
        <select-table :images="images"/>

        <!-- Content view 3 -->
        <!-- Type of card selection -->
        <component-selection/>

        <!-- Content view 4 -->
        <!-- Connect card layer names with AirTable data -->
        <field-selection v-if="fieldSelection"/>
       
        <!-- Content view 5 -->
        <coral-panel>
          <p class="coral-Body--XS m-t-50">The report has been created. You can now close the plugin.</p>
          
        </coral-panel>

      </coral-panelstack> 


      <!-- Left Button -->
      <coral-panelstack coral-wizardview-panelstack="" class="float-left panel-btns">
        <!-- 1 -->
        <coral-panel class="u-coral-margin">
          <button
            is="coral-button"
            variant="quiet"
            @click="closePlugin"
            >
              Cancel
          </button>
        </coral-panel>

        <!-- 2 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="" >Previous</button>
        </coral-panel>

        <!-- 3 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="">Previous</button>
        </coral-panel>
        
        <!-- 4 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="">Previous</button>
        </coral-panel>

        <!-- 5 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="">Previous</button>
        </coral-panel>

      </coral-panelstack>
      
      <!-- Right Button -->
      <coral-panelstack coral-wizardview-panelstack="" class="float-right panel-btns">
        <!-- API screen -->
        <coral-panel class="u-coral-margin">
          <button v-if="credentials.apiKey != '' && credentials.baseKey != '' " is="coral-button"  variant="primary" coral-wizardview-next=""> 
            Next 
          </button>
          <button v-else is="coral-button" variant="primary" disabled coral-wizardview-next=""> 
            Next 
          </button>
        </coral-panel>

        <!-- Select Table and table view -->
        <coral-panel class="u-coral-margin">
          <!-- <button is="coral-button" variant="primary" @click="getItems" coral-wizardview-next="" > -->
          <button v-if="selectedView != '' & tableName != ''" is="coral-button" variant="primary" @click="fetchAirTable" coral-wizardview-next="" >
            Next
          </button>
          <button v-else is="coral-button" variant="primary" disabled coral-wizardview-next="" >
            Next
          </button>
        </coral-panel>

        <!-- 3 -->
        <!-- Report components -->
        <coral-panel class="u-coral-margin">
          <button v-if="canProceed.componentSelection" is="coral-button" variant="primary" @click="fieldSelection = !fieldSelection" coral-wizardview-next="" >
            Next
          </button>
          <button v-else is="coral-button" variant="primary" disabled coral-wizardview-next="" >
            Next
          </button>
        </coral-panel>
        
        <!-- 4 -->
        <!-- Adds the library component to the componentsInUse arr
        & gets text layers to send them over to the Vue app. -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next @click="createReport">
            Create Report
          </button>
        </coral-panel>

        <!-- 5 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next>
            Close
          </button>
        </coral-panel>

      </coral-panelstack>

    </coral-wizardview>

  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields';
import * as Airtable from 'airtable'

// Coral wizard views
import StepList from './components/StepList.vue'
import PanelApi from './components/panels/PanelApi.vue'
import SelectTable from './components/panels/SelectTable.vue'
import ComponentSelection from './components/panels/ComponentSelection.vue'
import FieldSelection from './components/panels/FieldSelection.vue'

import Spinner from './components/Spinner.vue'
import FeedbackToast from './components/FeedbackToast.vue'


export default {
  name: "App",
  components: {
    StepList,
    PanelApi,
    SelectTable,
    ComponentSelection,
    Spinner,
    FeedbackToast,
    FieldSelection,
  },
  
  data() {
    return {
      
      fieldSelection: false,

      count: 2,
      db: [],
      recordsNum: 15,

      images:{
        tables: require("./assets/images/airtable_tables.jpg")
      },

      // tableName: "Insights",
      // baseKey: "appTSdEpXSi8tcX0J",
      // apiKey: "keyExKGas9NCSngJL",

      aTData: {},
      topicsTable:[],
      aTfieldsArray: [],
      textLayerNames: [],

      cardTypes:{
        insights:{
          name: "Insights",
          value: "insights",
          key: "16324faa210a930553c134d73595c7e8fcd3f87a",
          order: 2
        },
        exec_summary:{
          name: "Executive Summary",
          value: "exec_summary",
          key: "a9abf7679808249ff0e15c9b51bc465ce1381f0c",
          order: 1
        }
      },
      cardsToUse: [
        {
          card: "Card-1",
          value: "",
          name: ""
        }
      ],

      inputFieldValues: {
        insights: {},
        exec_summary: {
          pageDescription: "",
        }
      },
    };
  },

  computed:{
      ...mapState(['credentials', 'selectedView', 'tableName', 'canProceed', 'componentsToUse', 'allTables']),
      ...mapGetters(['canProceedReport']),
      
      // canProceedReportNext(){
      //   return this.canProceedReport
      // }
  },

  methods: {
    ...mapActions(['setIsWaiting', 'showToast', 'setAllTables']),

    async fetchAirTable(){
      const parentComp = this
      const apiKey = parentComp.credentials.apiKey
      const baseKey = parentComp.credentials.baseKey
      const selectedView = parentComp.selectedView
      const tableName = parentComp.tableName
      
      // Sets connection settings to desired db
      const base = new Airtable({apiKey: apiKey}).base(baseKey);

      // Shows the loading spinner
      parentComp.setIsWaiting(true)
      
      // Async function to get the data from AirTable
      await base(tableName).select({
        // Gets ALL records
        view: "Grid view"
      }).all().then( records =>{
        parentComp.setAllTables(records)
        console.log("records: ", records);
        // Hides the loading spinner
        parentComp.setIsWaiting(false)
        // Show success toast
        let toast = {
          msg: "Data fetched",
          type: "success"
        }
        parentComp.showToast(toast)
      })
      
    },

    createReport(){
      let parentComp = this
      let componentsToUse = parentComp.componentsToUse
      const apiKey = parentComp.credentials.apiKey
      const baseKey = parentComp.credentials.baseKey
      const selectedView = parentComp.selectedView

      // Sets connection settings to desired db
      const base = new Airtable({apiKey: apiKey}).base(baseKey);
      parentComp.setIsWaiting(true)

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Gets all the Database data.
      // Not the most efficinet thing,but good enough way to overcome the AirTable API limitaiton for the proof of concept.
      let allTables = parentComp.allTables
      let allTablesData = {}
      
      let thisWindow = window
      
      async function getAllData(){
        async function waitForLoop(){
          for(let table in allTables){
            await base(allTables[table]).select().all().then((record) => {
              allTablesData[allTables[table]] = record
            })
          }
        }
        await waitForLoop().then((record) =>{
          // Hides the loading spinner
          parentComp.setIsWaiting(false)
          console.log(allTablesData);
          sendMesage()
        })
      }
      getAllData()
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      function sendMesage(){
        componentsToUse = JSON.parse(JSON.stringify(componentsToUse));
        allTablesData = JSON.parse(JSON.stringify(allTablesData));

        parent.postMessage({
          pluginMessage: { code: "createReport", componentsToUse, allTablesData} 
        },"*");
        
      }

    },

    closePlugin(){
      parent.postMessage(
        { pluginMessage: { code: "closePlugin"} },
        "*"
      );
    }
  },

  mounted(){
    let parent = this;

    onmessage = (event) => {
      // Get a list of all components with their UID reference
      if (event.data.pluginMessage.code == "setCompRef") {
        this.$store.dispatch("setComponents", event.data.pluginMessage.payload)
      }
    }

  },

  created() {}
};
</script>

<style>
  @import url(css/coral-changed.css);
  @import url(css/snack-helper.css);
  @import url(css/app.css);
</style>