<template>
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
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields';


export default {
    name: "PanelApi",
    
    computed:{
      ...mapFields([
        'credentials.apiKey',
        'credentials.baseKey',
        ])
    },

    methods:{
      ...mapMutations(['ADD_RECORD']),
      ...mapActions(['removeRecord']),
      
      write(){
        this.ADD_RECORD("Yooo")
      },

      removeRecords(payload){
        this.removeRecord(payload)
      }
      
    }
}
</script>

<style>

</style>