<template>
  <coral-panel class="p-b-10">

    <h1 class="coral-Heading--XS p-t-10 p-b-15">Field Mapping</h1>
    <p class="coral-Body--XS p-b-5">Map the AirTable data with the library components.</p>

    <div>
      <div
        v-for="component in compList"
        :key="component.listId"
        class="m-b-25 p-b-15 coral-Well"
      >
        <p hidden>{{component.title}}</p>
        <h2
          class="coral-Heading--XS m-b-10 m-t-0"
        >
          {{ component.name }}
        </h2>

        <!--Dropdown to chose what base to get the data from  -->
        <form
          class="coral-Form coral-Form--vertical m-t-20 m-b-25"
        >
           <label 
              :id="'label_'+component.name"
              class="coral-FieldLabel"
            >
              Select a table
            </label>
          <coral-select
            :id="'dropDowns_' + component.name"
            placeholder="Choose a base from AirTable"
            @change="getAirTableFields"
          >
            <coral-select-item
              :labelledby="'label_'+component.name"
              v-for="table in allTables"
              :key="table"
              :value="table"
            >
              {{ table }}
            </coral-select-item>
            <coral-select-item value=""><i style="color: #959595;">Choose a table from AirTable</i></coral-select-item>
          </coral-select>
        </form>
        
        <hr class="coral-Divider--M full-w m-b-20">
        <!--Component layers dropdown -->

          <form
            class="coral-Form coral-Form--vertical m-b-20"
            v-for="layer in libraryComponents[component.title].layers"
            :key="layer.id"
          >
            <label 
              :id="layer.name"
              class="coral-FieldLabel"
            >
              {{ layer.name.replace("🔵","") }}
            </label>
            <coral-select
              :labelledby="layer.name"
              :id="'dropDown_' + layer.name"
              placeholder="Choose a component"
              
            >
              <coral-select-item
                v-for="comp in libraryComponents"
                :key="comp.name"
                :value="comp.title"
              >
                {{ comp.name }}
              </coral-select-item>
              <coral-select-item value=""><i style="color: #959595;">Choose a component</i></coral-select-item>
            </coral-select>
          </form>


      </div>
    </div>

  </coral-panel>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import * as Airtable from 'airtable'
// import { mapFields } from 'vuex-map-fields';


export default {
    name: "FieldSelection",
    
    components:{
    },

    computed:{
      ...mapGetters(['getState']),
      ...mapState(['libraryComponents', 'allTables']),

      compList(){
        let parent = this
        return parent.getState.componentsToUse
      }
    },

    methods:{
      ...mapActions(['setIsWaiting']),
      ...mapState(['credentials']),

      async getAirTableFields(e){

        let parentComp = this
        let apiKey = parentComp.getState.credentials.apiKey
        let baseKey = parentComp.getState.credentials.baseKey
        let selectedView = parentComp.selectedView
        let tableName = e.target.value

        if (tableName = " ") {
          console.log('tableName-22: ', e);
          return
        }

        console.log('type oftableName: ', typeof tableName);
        
        // // Shows the loading spinner
        parentComp.setIsWaiting(true)

        // Sets connection settings to desired db
        console.log(apiKey);
        var base = new Airtable({apiKey: apiKey}).base(baseKey);
        
        // Async function to get the data from AirTable
        await base(tableName).select({
          // Gets ALL records
          view: "Grid view"
        }).all().then( records =>{
          // parentComp.setAllTables(records)
          console.log("records: ", records);
          // Hides the loading spinner
          parentComp.setIsWaiting(false)
        })

      }

    }
}
</script>

<style>
</style>