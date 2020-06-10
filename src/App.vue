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
import * as Airtable from 'airtable'

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyHAas7QNbaGOpTj'
});

var base = Airtable.base('app6SuyzdnEbczu2W');

export default {
  name: "App",
  data() {
    return {
      count: 2,
      db: [],
      recordsNum: 1,
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
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  font: 12px sans-serif;
  text-align: center;
  margin: 20px;
}
button {
  border-radius: 5px;
  background: white;
  color: black;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  box-shadow: inset 0 0 0 1px black;
  outline: none;
}
#create {
  box-shadow: none;
  background: #18a0fb;
  color: white;
}
input {
  border: none;
  outline: none;
  padding: 8px;
}
input:hover {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}
button:focus {
  box-shadow: inset 0 0 0 2px #18a0fb;
}
#create:focus {
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
}
input:focus {
  box-shadow: inset 0 0 0 2px #18a0fb;
}
</style>