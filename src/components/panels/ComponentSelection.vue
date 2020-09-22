<template>
  <coral-panel class="p-b-10">

    <h1 class="coral-Heading--XS p-t-10 p-b-15">Report components</h1>

    <p class="coral-Body--XS p-b-5">Select the components to use on the report page, grab and drag the handle to re-arrange their order.</p>

      <!-- <div v-for="element in compListToUse" :key="element.listId">{{element.listId}}: {{ element.title }}</div> -->
    

    <div class="coral-Well m-t-20">
      <draggable v-model="compListToUse" class="select-group" group="people" @start="drag=true" @end="drag=false">
        <div
          v-for="section in compListToUse"
          class="drag-grid"
          :key="'dropDown_' + section.listId"
        >
          <coral-icon
            icon="DragHandle"
            class="m-auto h-full drag-handle"
            title="Drag Handle"
          >
          </coral-icon>

          <form class="coral-Form coral-Form--vertical m-b-0">
            <coral-select
              :id="'dropDown_' + section.listId"
              placeholder="Choose a component"
              :order="section.listId"
              @change="setCompToUse($event, section.listId)"
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
      </draggable>

      <div class="p-t-30" >
        <button
            is="coral-button"
            @click="addNewComp"
            class="w-full"
          >
            Add component
        </button>
      </div>
    </div>

  </coral-panel>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields';
import draggable from 'vuedraggable'


export default {
    name: "ComponentSelection",
    
    components:{
      draggable
    },

    computed:{
      ...mapState(['credentials', 'libraryComponents', 'componentsToUse']),
      ...mapGetters(['usableComponents', 'componentsToUseGetter']),

      compListToUse: {
        get() {
          return this.componentsToUse
        },
        set(value) {
          console.log(value);
          this.$store.commit({
            type: 'UPDATE_LIST',
            list: value,
          });
        }
      },

    },

    methods:{
      ...mapMutations(['ADD_RECORD']),
      ...mapActions(['setCompToValue', 'addCompToUse']),
      
      setCompToUse(e, listIdVal){
        let compTitle = e.target.value
        let listId = listIdVal
        this.setCompToValue({compTitle, listId})
      },

      addNewComp(){
        let parent = this;
        parent.addCompToUse()
      }

    }
}
</script>

<style>

</style>