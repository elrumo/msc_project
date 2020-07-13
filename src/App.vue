<template>
  <div class="main-view">
    <div class="nav-bar panel-btns"></div>
    
    <h1 class="coral-Heading--XS p-t-5">Airtable to Figma</h1>


    <coral-wizardview class="h-full">
      

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
            <label id="label" class="coral-FieldLabel f-s-14">Base URL</label>
            <input
              autofocus
              type="text"
              v-model="baseURL"
              class="coral-Form-field _coral-Textfield"
              ref="baseURLInput"
              name="baseURLInput"
              placeholder="Base URL from Airbase"
            >
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
        <coral-panel>
          {{ db }}
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
          <button is="coral-button" variant="cta" > Next </button>
        </coral-panel>

      </coral-panelstack>

    </coral-wizardview>



    <!-- <h1 class="coral-Heading--XXS">How many records?</h1>
    <form class="coral-Form coral-Form--vertical">
        <coral-numberinput :value="recordsNum" id="textArea" labelledby="label1"></coral-numberinput>
    </form>
    <div v-if="db[0]" class="">
      Data fetched
    </div>
    <button is="coral-button" @click="findLayers">Create Report</button>
    <button is="coral-button" @click="getItems">Fetch Data</button> -->



  </div>
</template>

<script>
import Vuent from 'vuent';
import * as Airtable from 'airtable'

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyExKGas9NCSngJL'
});



// Not  working ->  https://api.airtable.com/v0/shrB9LtTWEQmBuaBn/tbljEcbiDELjeVunk/Insights?maxRecords=3&view=Grid+view 

export default {
  name: "App",
  data() {
    return {
      count: 2,
      db: [],
      tableName: "",
      recordsNum: 5,
      airtableBase: "",
      baseURL: "",
      urlKey: "",
      fieldsArray: [],
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

    focusOnInput(){
        this.$refs.tableNameInput.focus()
    },
    
    closePlugin: function() {
      parent.postMessage(
        { pluginMessage: { type: "closePlugin"} },
        "*"
      );
    },
    getItems(){
      const parentComp = this
      var urls = parentComp.baseURL
      console.log(urls);
      const noData = { rows: [], columns: [], url: '' }

      function serialize(obj) {
        const str = []
        for (const p in obj) {
          if (obj.hasOwnProperty(p) && obj[p]) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          }
        }
        return str.join('&')
      }      

      function scrape(url) {

            return fetch(
              'https://airtable-shr.glitch.me/api?' +
                serialize({
                  url,
                })
            )
              .then(r => r.json())
              .then(data => {
                if (data && data.data) {
                  console.log(0)
                  data = data.data
                }
                if (!data || !data.rows || !data.columns) {
                  console.log(1)
                  return noData
                }
                console.log(2)
                return data
              })
              .catch(e => {
                console.log(e.message)
                return noData
              })
              .then(data => {
                console.log(4)
                data.url = url
                // Get key url for selected Airtbale database
                parentComp.urlKey = data.sortTiebreakerKey
                console.log(parentComp.urlKey)
                
                // Sets connection settings to desired db
                var base = new Airtable.base(parentComp.urlKey);
                
                
                // Functions
                console.log(base);
                // Connect to selected airtbale database
                function connectToDb(){
                  base(parentComp.tableName).select({
                      // Selecting the first 3 records in Grid view:
                      maxRecords: 10,
                      view: "Grid view"
                  }).eachPage(function page(records, fetchNextPage) {
                      // This function (`page`) will get called for each page of records.
                      for(let field in records[0].fields){
                        parentComp.fieldsArray.push(field)
                      }

                      console.log(parentComp.fieldsArray);
                      records.forEach(function(record) {
                          // console.log('Retrieved', record.get('Insight type'));
                        
                          // console.log(record.fields)
                        

                        // base(parentComp.tableName).find(record.id, function(err, record2){ 
                        //   var item = {
                        //     "id": record2.id,
                        //     "name": record2.fields.Name,
                        //     "session type": record2.fields["Session type"],
                        //     "notes": record2.fields.Notes,
                        //   }
                        //   parentComp.db.push(item);
                        // })

                      });

                      // To fetch the next page of records, call `fetchNextPage`.
                      // If there are more records, `page` will get called again.
                      // If there are no more records, `done` will get called.
                      fetchNextPage();

                    }, function done(err) {
                        if (err) { console.error(err); return; }
                  });
                }
              
                // To execute functions
                connectToDb()
                return data
              })
          }

      scrape(urls)

    //   base('Feedback sessions').select({
        //     // Selecting the first 3 records in All sessions:
        //     maxRecords: parentComp.recordsNum,
        //     view: "All sessions"
        //       }).eachPage(function page(records, fetchNextPage) {
        //         // This function (`page`) will get called for each page of records.
        //           records.forEach(function(record) {
                    
        //               // parent.db = record.id;
        //             base('Feedback sessions').find(record.id, function(err, record2){ 
        //               var item = {
        //                 "id": record2.id,
        //                 "name": record2.fields.Name,
        //                 "session type": record2.fields["Session type"],
        //                 "notes": record2.fields.Notes,
        //               }
        //               parentComp.db.push(item);
        //               // console.log(records)
        //             })
        //           });
        //           // To fetch the next page of records, call `fetchNextPage`.
        //           // If there are more records, `page` will get called again.
        //           // If there are no more records, `done` will get called.
        //           fetchNextPage();
        //       }, function done(err) {
        //         if (err) { console.error(err); return; }
        //     });
    }
  },

  mounted(){
    this.$refs.baseURLInput.focus()
  },

  created() {}
};
</script>

<style>
  @import url(css/coral-changed.css);
  @import url(css/snack-helper.css);
  @import url(css/app.css);
</style>