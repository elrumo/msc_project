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

        <!-- Content view 6 -->
        <coral-panel>
          <p class="coral-Body--XS p-b-5">Yoooo</p>
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

        <!-- 6 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="">Previous</button>
        </coral-panel>

      </coral-panelstack>
      
      <!-- Right Button -->
      <coral-panelstack coral-wizardview-panelstack="" class="float-right panel-btns">
        <!-- API screen -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button"  variant="primary" coral-wizardview-next=""> 
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
          <button v-if="canProceed" is="coral-button" variant="primary" @click="fieldSelection = !fieldSelection" coral-wizardview-next="" >
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
          <button is="coral-button" variant="primary" coral-wizardview-next @click="saveInputData">
            Create Report
          </button>
        </coral-panel>

        <!-- 5 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next @click="closePlugin">
            Close
          </button>
        </coral-panel>

        <!-- 6 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next @click="writeToFigma" >
            Next
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
      ...mapState(['credentials', 'selectedView', 'tableName', 'canProceed']),
      ...mapGetters(['canProceedReport']),

      canProceedReportNext(){
        return this.canProceedReport
      }
  },

  methods: {
    ...mapActions(['setIsWaiting', 'showToast', 'setAllTables']),

    async fetchAirTable(){
      const parentComp = this
      const apiKey = parentComp.credentials.apiKey
      const baseKey = parentComp.credentials.baseKey
      const selectedView = parentComp.selectedView
      const tableName = parentComp.tableName
      
      // Shows the loading spinner
      parentComp.setIsWaiting(true)

      // Sets connection settings to desired db
      var base = new Airtable({apiKey: apiKey}).base(baseKey);
      
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




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    findLayers: function() {
      const db = this.db
      let parent = this

      parent.postMessage(
        { pluginMessage: { type: "find-layers", db} },
        "*"
      );
    },
    
    fetchComponentCards(){
      // Get input data and save to Vue.
      let parentComp = this
      let cardsToUse =  parentComp.cardsToUse
      for(let card in this.$refs["cardsToUse"]){
        console.log(parentComp.cardTypes[this.$refs["cardsToUse"][card].value].value);
        cardsToUse[card].value = parentComp.cardTypes[this.$refs["cardsToUse"][card].value].value
        cardsToUse[card].name = parentComp.cardTypes[this.$refs["cardsToUse"][card].value].name
        // cardsToUse[card] = parentComp.cardTypes[this.$refs["cardsToUse"][card].value]
      }
      // console.log(document.getElementById("cardSelection").value)
      parent.postMessage({ pluginMessage: { type: "fetchComponentCards", cardsToUse} }, "*" );
    },

    closePlugin: function() {
      parent.postMessage({ pluginMessage: { type: "closePlugin"} }, "*" );
    },
    
    async getItems(){
      const parentComp = this
      const fieldsArrayConst = parentComp.aTfieldsArray

      // Sets connection settings to desired db
      var base = new Airtable({apiKey: parentComp.apiKey}).base(parentComp.baseKey);
      
      // Functions

      // Gets all the records for the Topics table
      function getTopicsTable(){
        base("Topics").select({
          // Selecting the first 15 records in Grid view:
          maxRecords: parentComp.recordsNum,
          view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
          for(let record in records){
            parentComp.topicsTable.push({
              id: records[record].id,
              topic: records[record].fields.Topic,
              fields: records[record].fields
            });
          }
        })
      }
      const promise1 = new Promise(function(topicsTable){
        topicsTable(
          getTopicsTable(),
        )
      }).then(()=>{
        // Wait to get all Topics before gettin the main table data
         connectToDb()
      })

      // Connect to selected airtbale database
      function connectToDb(){
        // Empty fields array everytime the func is ran
        parentComp.aTfieldsArray = []
        var tempFieldsArray = []
        let numField = 0
        base(parentComp.tableName).select({
            // Selecting the first 15 records in Grid view:
            maxRecords: parentComp.recordsNum,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
            
            // Var needed to compar the lenght of record.fields to get a list of all fields/columnds in the DataBase.
            var mostFields = {
              numOfFields: 0,
            };
            // Save AirTable data to array
            for(let record in records){
              // Get record data value and save it to Vue arr
              parentComp.aTData[records[record].id] = records[record].fields  
              // There is no API to get all the columns or fields, so I'm iterating through the records and finding the one that has the most fields: https://community.airtable.com/t/accessing-tables-model-via-api/13408/10
              let numberOfFields = Object.keys(records[numField].fields).length
              if (mostFields.numOfFields < numberOfFields) {
                mostFields.numOfFields = numberOfFields
                mostFields.record = records[record].fields
                // Save name of text fields to array
                parentComp.aTfieldsArray = Object.keys(records[record].fields)
                // console.log(Object.keys(records[record].fields));
              }
              numField++
            }
            // Get Figma layers
            // parent.postMessage( { pluginMessage: { type: "find-layers", tempFieldsArray} }, "*" );
            
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
          }, function done(err) {
              if (err) { console.error(err); return; }
        });
      }
        
      // connectToDb()
    },

    writeToFigma(){
      let parentComp = this

      // Gets data from input and saves it to Vue data
      for(let card in parentComp.textLayerNames){
        if(card == "insights"){
          for(let layer in parentComp.textLayerNames[card]){
            let textLayerName = parentComp.textLayerNames[card][layer]
            var inputValue = parentComp.$refs[parentComp.textLayerNames[card][layer]][0].value // Value of input
            // console.log(textLayerName,": ", inputValue );
            parentComp.inputFieldValues[card][textLayerName] = inputValue
            // console.log(parentComp.inputFieldValues[card]);
          }
        }
      }
      
      let inputFieldValues = parentComp.inputFieldValues
      let aTData = parentComp.aTData
      let topicsTable = parentComp.topicsTable

      // parentComp.aTData

      let data = {"inputFieldValues": inputFieldValues, "aTData": aTData, "topicsTable": topicsTable }

      // Add component cards to Figma page report
      parent.postMessage({ pluginMessage: { type: "updateFigmaLayers", data}}, "*");
    },

    saveInputData(){
      let parent = this
      // Get data input from input forms.
      for(let el in parent.cardsToUse){
        if(parent.cardsToUse[el].value == "exec_summary"){
          parent.inputFieldValues.exec_summary.pageDescription = parent.$refs.pageDescriptionInput[0].value
        }
      }
      parent.writeToFigma()
    },

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