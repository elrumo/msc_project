<template>
 <coral-panel>
    <h1 class="coral-Heading--XS p-t-10 p-b-15">Select table and view</h1>

    <label id="label" class="coral-FieldLabel f-s-14"> Table Name </label>
    <input
      type="text"
      v-model="tableName"
      class="coral-Form-field _coral-Textfield"
      ref="tableNameInput"
      name="tableNameInput"
      placeholder="Name of table"
    >

    <section class="p-t-15">
      <label id="tableViewLabel" class="coral-FieldLabel f-s-14"> Table View </label>
      <coral-select
        labelledby="tableViewLabel"
        ref="cardsToUse"
        placeholder="Choose a view"
        id="tableViewPicker"
        @change="selectViewMethod"
      >
        <coral-select-item
          v-for="type in viewTypes"
          :key="type"
          :value="type"
          :id="type"
        >
          {{ type }}
        </coral-select-item>
      </coral-select>
    </section>

    
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
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields';

export default {
    name: "SelectTable",

    props:{
      images: Object
    },

    data(){
      return{
      }
    },

    computed:{
      ...mapFields(['tableName']),
      ...mapState(['viewTypes']),
    },

    methods:{      
      ...mapActions(['selectViewAction']),
      
      // Get the dropdown value and set an action to save it to the Vuex store
      selectViewMethod(e){
        this.selectViewAction(e.target.value)
      }
    }
}
</script>

<style>

</style>