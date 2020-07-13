<template>
  <div>
    <!-- <img src="./logo.svg" alt="Logo" /> -->
    <h2>How many records?</h2>
    <textarea :value="recordsNum" id="textArea" cols="30" rows="1"></textarea>
    <div v-if="db[0]" class="">
      <!-- {{ item.Name }} -->
      Data fetched
      <!-- {{ item.Notes }} -->
    </div>
    <button @click="findLayers">Create Report</button>
    <button @click="getItems">Fetch Data</button>
  </div>
</template>

<script>
import Vuent from 'vuent';
import * as Airtable from 'airtable'

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyExKGas9NCSngJL'
});

var base = Airtable.base('app6SuyzdnEbczu2W');

export default {
  name: "App",
  data() {
    return {
      count: 2,
      db: [],
      recordsNum: 1,
      airtableBase: ""
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
    getItems(){
      const parentComp = this
      parentComp.recordsNum = parseInt(document.getElementById("textArea").value)
      console.log(parentComp.recordsNum)
      base('Feedback sessions').select({
        // Selecting the first 3 records in All sessions:
        maxRecords: parentComp.recordsNum,
        view: "All sessions"
          }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
              records.forEach(function(record) {
                
                  // parent.db = record.id;
                base('Feedback sessions').find(record.id, function(err, record2){ 
                  var item = {
                    "id": record2.id,
                    "name": record2.fields.Name,
                    "session type": record2.fields["Session type"],
                    "notes": record2.fields.Notes,
                  }
                  parentComp.db.push(item);
                  // console.log(records)
                })
              });
              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              fetchNextPage();
          }, function done(err) {
            if (err) { console.error(err); return; }
        });
    }
  },

  mounted(){
  },

  created() {}
};
</script>

<style>
  @import url(app.css);
</style>