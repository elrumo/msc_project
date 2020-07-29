<template>
  <div class="main-view">
    
    <div class="nav-bar panel-btns"></div>
    
    <h1 class="coral-Heading--XS p-t-5">Airtable to Figma</h1>


    <coral-wizardview class="h-full">
      
      <!-- TODO: #3 Create components instead of writing everything in here as pure html -->
      <!-- Steps -->
      <coral-steplist coral-wizardview-steplist="" class="steps" interaction="on">
        <coral-step>Step 1</coral-step>
        <coral-step>Step 2</coral-step>
        <coral-step>Step 3</coral-step>
      </coral-steplist>

      <!-- Content views -->
      <coral-panelstack coral-wizardview-panelstack="" class="p-t-25">
        
        <!-- Content view 1 -->
        <coral-panel>
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
          <ul class="coral-List--minimal p-t-15 f-s-12 f-w-200">
            <li class="coral-List-item">1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus adipiscing arcu pretium.</li>
            <li class="coral-List-item">2. Semper quisque. Molestie sit vitae in pretium feugiat feugiat eu amet libero. Feugiat habitasse</li>
            <li class="coral-List-item">3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus adipiscing arcu pretium.</li>
          </ul>
        </coral-panel>
        
        <!-- Content view 2 -->
        <coral-panel>
          <label id="label" class="coral-FieldLabel f-s-14">Table Name</label>
            <input
              type="text"
              v-model="tableName"
              class="coral-Form-field _coral-Textfield"
              ref="tableNameInput"
              name="tableNameInput"
              placeholder="Name of table"
            >
           <!-- Instructions  -->
          <ul class="coral-List--minimal p-t-15 f-s-12 f-w-200">
            <li class="coral-List-item">1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus adipiscing arcu pretium.</li>
            <li class="coral-List-item">2. Semper quisque. Molestie sit vitae in pretium feugiat feugiat eu amet libero. Feugiat habitasse</li>
            <li class="coral-List-item">3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus adipiscing arcu pretium.</li>
          </ul>

        </coral-panel>

        <!-- Content view 3 -->
        <coral-panel class="p-b-10">
          
          <p class="coral-Body--XS p-b-5">Select layers to fill with data.</p>

          <div v-for="layer in textLayerNames" :key="layer" class="p-b-5">
            <form class="coral-Form coral-Form--vertical">
              <label :aria-label="layer" class="coral-Form-fieldlabel">{{ layer }}</label>
              
              <coral-select :labelledby="layer" :ref="layer" placeholder="Choose an item">
                <!-- TODO: #2 Each item should be a layer on Figma, use a for each. -->
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
          </div>
        </coral-panel>

      </coral-panelstack> 

      <!-- Left Button -->
      <coral-panelstack coral-wizardview-panelstack="" class="float-left panel-btns">
        
        <coral-panel class="u-coral-margin">
          <button
            is="coral-button"
            variant="quiet"
            @click="closePlugin"
            >
              Cancel
          </button>
        </coral-panel>

        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="" >Previous</button>
        </coral-panel>

        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="quiet" coral-wizardview-previous="">Previous</button>
        </coral-panel>

      </coral-panelstack>
      
      <!-- Right Button -->
      <coral-panelstack coral-wizardview-panelstack="" class="float-right panel-btns">

        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" coral-wizardview-next="" @click="focusOnInput" > Next </button>
        </coral-panel>

        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="primary" @click="getItems" coral-wizardview-next="" > Next </button>
        </coral-panel>

        <coral-panel class="u-coral-margin">
          <button is="coral-button" variant="cta" @click="writeToFigma" > Import Data </button>
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

      tableName: "Insights",
      // tableName: "",
      baseKey: "appTSdEpXSi8tcX0J",
      // baseKey: "",
      apiKey: "keyExKGas9NCSngJL",
      // apiKey: "",

      aTData: {},
      aTfieldsArray: [],
      textLayerNames: [],

      inputFieldValues: {},
    };
  },
  methods: {
    findLayers: function() {
      const db = this.db
      parent.postMessage(
        { pluginMessage: { type: "find-layers", db} },
        "*"
      );
    },
    
    // TODO: #1 Add visual loader when data is being fetched. 

    focusOnInput(){
        this.$refs.tableNameInput.focus()
    },
    
    closePlugin: function() {
      parent.postMessage({ pluginMessage: { type: "closePlugin"} }, "*" );
    },
    
    getItems(){
      const parentComp = this
      const fieldsArrayConst = parentComp.aTfieldsArray

      // Sets connection settings to desired db
      var base = new Airtable({apiKey: parentComp.apiKey}).base(parentComp.baseKey);
        
      
      // Functions
      // Connect to selected airtbale database
      function connectToDb(){
        
        // Empty fields array everytime the func is ran
        parentComp.aTfieldsArray = []
        var tempFieldsArray = []

        base(parentComp.tableName).select({
            // Selecting the first 15 records in Grid view:
            maxRecords: parentComp.recordsNum,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            // Save name of text fields to array
            for(let field in records[0].fields){
              tempFieldsArray.push(field)
            }
            parentComp.aTfieldsArray = tempFieldsArray
            
            // Save AirTable data to array
            for(let record in records){
                parentComp.aTData[records[record].id] = records[record].fields
            }
            
            // Get Figma layers
            parent.postMessage( { pluginMessage: { type: "find-layers", tempFieldsArray} }, "*" );
            

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

          }, function done(err) {
              if (err) { console.error(err); return; }
        });
      }
        
        connectToDb()
    },

    writeToFigma(){
      let parentComp = this

      // Gets data from input and saves it to Vue data
      for(const ref in parentComp.$refs){
        for(const layer in parentComp.textLayerNames){
          var figmaLayer = parentComp.textLayerNames[layer]
          if(figmaLayer == ref){
            var inputValue = parentComp.$refs[figmaLayer][0].value
            parentComp.inputFieldValues[figmaLayer] = {"name": figmaLayer, "value": inputValue}
          }
        }
      }
      
      let inputFieldValues = parentComp.inputFieldValues
      let aTData = parentComp.aTData

      let data = {"inputFieldValues": inputFieldValues, "aTData": aTData }

      parent.postMessage(
        { pluginMessage: { type: "updateFigamaLayers", data}}, "*");

    }

  },

  mounted(){
    let parent = this;
    debugger
    this.$refs.apiKeyInput.focus()
    
    // Listen to events from code.ts
    onmessage = (event) => {
    let parentComp = this;
      if(event.data.pluginMessage.postMessage == "layerNames"){
        parentComp.textLayerNames = event.data.pluginMessage.layerNamesArr
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