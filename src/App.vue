<template>
  <div class="main-view">
    
    <div class="nav-bar panel-btns"></div>
    


    <coral-wizardview>
      
      <!-- TODO: #3 Create components instead of writing everything in here as pure html -->
      <!-- Steps -->
      <coral-steplist coral-wizardview-steplist="" class="steps" interaction="on">
        <coral-step>Step 1</coral-step>
        <coral-step>Step 2</coral-step>
        <coral-step>Step 3</coral-step>
        <coral-step>Step 4</coral-step>
        <coral-step>Step 5</coral-step>
        <coral-step>Step 6</coral-step>
        <coral-step>Step 7</coral-step>
        <coral-step>Step 8</coral-step>
      </coral-steplist>

      <!-- Content views -->
      <coral-panelstack coral-wizardview-panelstack="" class="">

        <!-- Content view 1 -->
        <coral-panel>
          <h1 class="coral-Heading--XS p-t-10 p-b-15">Airtable to Figma</h1>

          <!-- API Key -->
          <div class="p-b-10">
            <label id="label-API-key" class="coral-FieldLabel f-s-14">API Key</label>
            <input
              autofocus
              type="text"
              v-model="apiKey"
              class="coral-Form-field _coral-Textfield"
              ref="apiKeyInput"
              name="baseURLInput"
              placeholder="API Key from Airbase"
            >
          </div>

          <!-- Base Key -->
          <div>
            <label id="label-base-key" class="coral-FieldLabel f-s-14">Base Key</label>
            <input
              type="text"
              v-model="baseKey"
              class="coral-Form-field _coral-Textfield"
              ref="baseURLInput"
              name="baseURLInput"
              placeholder="Base Key from Airbase"
            >
          </div>

          <!-- Instructions  -->
          <ul class="coral-List--minimal p-t-5 m-b-0 f-w-200">
            <li class="coral-List-item">
              <h3 class="coral-Heading--XXXS m-b-5">
                How can I get my API Key? 
              </h3>
              <p class="coral-Body--XS">
                Visit <a href="https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-" target="_blank" class="coral-Link"> this page </a> to see how.
              </p>
            </li>
            <li class="coral-List-item">
              <h3 class="coral-Heading--XXXS m-b-5 m-t-5">
                How can I get the base Key?
              </h3>
              <p class="coral-Body--XS">
                Visit <a href="https://airtable.com/api" target="_blank" class="coral-Link"> this page </a> to get it.
              </p>
            </li>
          </ul>
        </coral-panel>
        
        <!-- Content view 2 -->
        <coral-panel>
          <h1 class="coral-Heading--XS p-t-10 p-b-15">Select table</h1>

          <label id="label" class="coral-FieldLabel f-s-14"> Table Name </label>
          <input
            type="text"
            v-model="tableName"
            class="coral-Form-field _coral-Textfield"
            ref="tableNameInput"
            name="tableNameInput"
            placeholder="Name of table"
          >
          
          <!-- Instructions  -->
          <div class="p-t-40">
            <coral-card variant="quiet">
              <coral-card-asset class="opacity-80">
                <img alt="" :src="images.tables">
              </coral-card-asset>
              <coral-card-content class="opacity-80" style="transform: translateY(-5px)">
                <h3 class="coral-body--S f-s-16 m-0">Type the name of a table from your AirTable database as seen on the example image.</h3>
              </coral-card-content>
            </coral-card>
          </div>
        </coral-panel>

        <!-- Content view 3 -->
        <!-- Type of card selection -->
        <coral-panel class="p-b-10">
          <h1 class="coral-Heading--XS p-t-10 p-b-15">Report components</h1>

          <p class="coral-Body--XS p-b-5">Select the components to use on this page.</p>

          <div>
            <div v-for="card in cardsToUse" :key="card.card">
              <form class="coral-Form coral-Form--vertical">
                <coral-select
                  :id="card.cards"
                  :labelledby="card.cards"
                  ref="cardsToUse"
                  placeholder="Choose a component"
                >
                  <coral-select-item
                    v-for="cardType in cardTypes"
                    :key="cardType.name"
                    :value="cardType.value"
                  >
                    {{ cardType.name }}
                  </coral-select-item>
                  <coral-select-item value=""><i style="color: #959595;">Choose a component</i></coral-select-item>
                </coral-select>

              </form>
            </div> 
          </div>
          
          <div class="p-t-20" >
            <button
                is="coral-button"
                @click="addNewCard"
                class="w-full"
              >
                Add another component
            </button>
          </div>
        </coral-panel>

        <!-- Content view 4 -->
        <!-- Connect cad layer names with AirTable data -->
        <coral-panel>
            <div v-for="component in cardsToUse" :key="component.card+'_component'" class="p-b-20">
              <p class="f-w-700 f-s-16 m-b-5 m-t-0">{{ component.name }}</p>
              <div v-for="layer in textLayerNames[component.value]" :key="layer">
                <div v-if="layer == 'title-default'" class="p-t-10 p-b-15">
                </div>  
                <form v-else-if="layer !== 'description-text' " class="coral-Form coral-Form--vertical">
                  <label :aria-label="layer" class="coral-Form-fieldlabel">{{ layer }}</label>    
                  <coral-select :labelledby="layer" :ref="layer" placeholder="Choose an item">
                    <coral-select-item
                      v-for="aTfield in aTfieldsArray"
                      :key="aTfield"
                      :value="aTfield"
                    >
                      {{ aTfield }}
                    </coral-select-item>
                    <coral-select-item value=""><i style="color: #959595;">Choose an item</i></coral-select-item>
                  </coral-select>
                </form>
                
                <div v-else-if="layer == 'description-text'" class="p-t-10">
                  <textarea
                    is="coral-textarea"
                    placeholder="Page description"
                    ref="pageDescriptionInput"
                    class="r-4"
                    aria-label="text input" 
                  >
                  </textarea>
                </div>

              </div>
            </div>
        </coral-panel>
       
        <!-- Content view 5 -->
        <coral-panel>
          <p class="coral-Body--XS p-b-5">The report has been created.</p>
          
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
        <!-- 1 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next=""> 
            Next 
          </button>
        </coral-panel>

        <!-- 2 -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" @click="getItems" coral-wizardview-next="" >
            Next
          </button>
        </coral-panel>

        <!-- 3 -->
        <!-- Type of card selection -->
        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" @click="fetchComponentCards" coral-wizardview-next="" >
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
import Vuex from 'vuex'
import * as Airtable from 'airtable'

export default {
  name: "App",
  data() {
    return {
      count: 2,
      db: [],
      recordsNum: 15,

      images:{
        tables: require("./assets/images/airtable_tables.jpg")
      },

      tableName: "Insights",
      baseKey: "appTSdEpXSi8tcX0J",
      apiKey: "keyExKGas9NCSngJL",

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
  methods: {
    findLayers: function() {
      const db = this.db
      let parent = this

      parent.postMessage(
        { pluginMessage: { type: "find-layers", db} },
        "*"
      );
    },
    
    // TODO: #1 Add visual loader when data is being fetched. 
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

    addNewCard(){
      let parent = this
      parent.cardsToUse.push({
       card: "Card-" + (parent.cardsToUse.length + 1),
       value: ""
      })
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

    writeToFigmaOld(){
      //   let parentComp = this

      //   // Gets data from input and saves it to Vue data
      //   for(const ref in parentComp.$refs){
      //     for(const layer in parentComp.textLayerNames){
      //       var figmaLayer = parentComp.textLayerNames[layer]
      //       if(figmaLayer == ref){
      //         var inputValue = parentComp.$refs[figmaLayer][0].value
      //         parentComp.inputFieldValues[figmaLayer] = {"name": figmaLayer, "value": inputValue}
      //       }
      //     }
      //   }
        
      //   let inputFieldValues = parentComp.inputFieldValues
      //   let aTData = parentComp.aTData

      //   let data = {"inputFieldValues": inputFieldValues, "aTData": aTData }

      //   parent.postMessage({ pluginMessage: { type: "test", data}}, "*");
      //     // { pluginMessage: { type: "updateFigmaLayers", data}}, "*");
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

    // document.getElementById("myBtn").addEventListener("click", displayDate);

    // Focus on form on crated
    // this.$refs.apiKeyInput.focus()
    
    // Listen to events from code.ts
    onmessage = (event) => {
      let parentComp = this;
      let msg = event.data.pluginMessage
        if(msg.postMessage == "layerNames"){
          // for(let layer in msg.componentsInUse.layers){
            // console.log("layer: ", layer); 
          parentComp.textLayerNames = msg.componentsInUse.layers
          
          // for(const layer in parentComp.textLayerNames){
          //   console.log("layer: ", layer)
          // }
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