<template>
  <coral-panel class="p-b-10">

    <h1 class="coral-Heading--XS p-t-10 p-b-15">Report components</h1>

    <p class="coral-Body--XS p-b-5">Select the components to use on this page.</p>
          <coral-masonry orderable="" id="masonry" layout="fixed-centered" columnwidth="250" aria-label="Masonry">
            <coral-masonry-item class="coral-Well">
              <article>
                <span coral-masonry-draghandle=""></span>
                With image
                <img src="http://via.placeholder.com/100x300" alt="">
              </article>
            </coral-masonry-item>
            <coral-masonry-item class="coral-Well">
              <article>
                <span coral-masonry-draghandle=""></span>
                card
                <br>card
              </article>
            </coral-masonry-item>
          </coral-masonry>
    <!-- <div class="coral-Well">
      <div v-for="section in componentsToUse" :key="'dropDown_' + section.order">
        <form class="coral-Form coral-Form--vertical">
          <coral-select
            :id="'dropDown_' + section.order"
            placeholder="Choose a component"
            :order="section.order"
            @change="setCompToUse"
          >
            <coral-select-item
              v-for="comp in componentLibrary"
              :key="comp.name"
              :value="comp.title"
            >
              {{ comp.name }}
            </coral-select-item>
            <coral-select-item value=""><i style="color: #959595;">Choose a component</i></coral-select-item>
          </coral-select>

        </form>
      </div> 

      <div class="p-t-20" >
        <button
            is="coral-button"
            @click="addNewComp"
            class="w-full"
          >
            Add another component
        </button>
      </div>
    </div> -->

  </coral-panel>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields';

export default {
    name: "ComponentSelection",
    
    computed:{
      ...mapState(['credentials', 'componentLibrary', 'componentsToUse']),
      ...mapGetters(['usableComponents', 'componentsToUseGetter']),
    },

    methods:{
      ...mapMutations(['ADD_RECORD']),
      ...mapActions(['removeRecord', 'setCompToValue', 'addCompToUse']),
      
      setCompToUse(e){
        let comp = e.target.value
        let order = e.target.id.replace("dropDown_","")
        console.log(order);
        this.setCompToValue({comp, order})
      },

      addNewComponent(){
        let parent = this
        parent.cardsToUse.push({
          card: "Card-" + (parent.cardsToUse.length + 1),
          value: ""
        })
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