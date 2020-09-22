<template>
  <coral-panel class="p-b-10">

    <h1 class="coral-Heading--XS p-t-10 p-b-15">Field Mapping</h1>
    <p class="coral-Body--XS p-b-20">Map the AirTable data with the library components.</p>

    <div>
      <div
        v-for="component in componentsToUse"
        :key="component.key"
        class="m-b-40"
      >
        <div class="coral-Well">

          <p hidden>{{component.title}}</p>
          <h2 class="coral-Heading--XS m-b-10 m-t-0" >
            {{ component.name }}
          </h2>

          <!--Dropdown to chose what base to get the data from  -->
          <form class="coral-Form coral-Form--vertical m-t-20 m-b-30" >
            <label 
                :id="'label_'+component.name"
                class="coral-FieldLabel"
              >
                Select a table
              </label>
            <coral-select
              :id="'dropDowns_'+component.title"
              placeholder="Choose a base from AirTable"
              @change="getAirTableFields($event, component.name)"
            >
              <coral-select-item
                :labelledby="'label_'+component.title"
                v-for="table in allTables"
                :key="table"
                :value="table"
              >
                {{ table }}
              </coral-select-item>
              <coral-select-item value=""><i style="color: #959595;">Choose a table from AirTable</i></coral-select-item>
            </coral-select>
          </form>
          
            <!-- v-for="layer in libraryComponents[component.title].layers" -->
           <form
            class="coral-Form coral-Form--vertical m-b-10 m-t-20"
            v-for="layer in component.comp.layers"
            :key="layer.key"
          >
            <label 
              :id="layer.name"
              class="coral-FieldLabel"
            >
              <!-- {{ layer.name }} -->
              {{ layer.name.replace("🔵","") }}
            </label>
            <coral-select
              :labelledby="layer.name"
              :id="'dropDown_' + layer.name"
              placeholder="Choose a component"
              @change="setAirTableToLayer($event, layer.name, component.name)"
            >
              <coral-select-item
                v-for="field in component.tableData.fields"
                :key="field+layer.name"
                :value="field"
              >
                {{ field }}
              </coral-select-item>
              <coral-select-item value=""><i style="color: #959595;">Choose a component</i></coral-select-item>
            </coral-select>
          </form> 
        </div>
      </div>
      <hr v-if="compList.length > 1" class="coral-Divider--S full-w m-b-25 m-t-25">
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
    
    data(){
      return{
      }
    },

    computed:{
      ...mapState(['credentials', 'libraryComponents', 'allTables', 'tableData', 'componentsToUse']),
      ...mapGetters(['getState', 'tableDataArr']),

      componentsList(){
        console.log(this.componentsToUse);
        return this.componentsToUse
      },
    },

    methods:{
      ...mapActions(['setIsWaiting', 'setTableData', 'setAirTableToFigmaLayer']),
      // ...mapState(['credentials', 'componentsToUse']),

      compList(payload){
        let parentComp = this
        console.log(payload);

        return parentComp.componentsToUse
      },

      async getAirTableFields(e, compName){

        let parentComp = this
        let apiKey = parentComp.getState.credentials.apiKey
        let baseKey = parentComp.getState.credentials.baseKey
        let selectedView = parentComp.selectedView
        let tableName = e.target.value

        if (tableName == "") {
          console.log('tableName: ', tableName);
          return
        }
        
        // // Shows the loading spinner
        parentComp.setIsWaiting(true)

        // // Sets connection settings to desired db
        console.log(apiKey);
        var base = new Airtable({apiKey: apiKey}).base(baseKey);
        
        // // Async function to get the data from AirTable
        await base(tableName).select({
          // Gets ALL records
          view: "Grid view"
        }).all().then( records =>{
          parentComp.setTableData({records, tableName, compName})
          // Hides the loading spinner
          parentComp.setIsWaiting(false)
        })
      },

      setAirTableToLayer(e, figmaLayer, componentName){
        let parentComp = this

        let airTableData = e.target.value
        console.log(airTableData);
        console.log(figmaLayer);
        console.log(componentName);

        parentComp.setAirTableToFigmaLayer({airTableData, figmaLayer, componentName})
      }

    }
}
</script>

<style>
</style>