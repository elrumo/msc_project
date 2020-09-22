// TODO NEXT -> Get the layers to change for the report components.



import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    credentials:{
      // apiKey: "",
      // baseKey: "",
      apiKey: "keyExKGas9NCSngJL",
      baseKey: "appTSdEpXSi8tcX0J",
    },
    
    // tableName: "",
    tableName: "All Tables",
    
    viewTypes: [
      "Grid",
      "Form",
      "Calendar",
      "Gallery",
      "Kanban"
    ],
    selectedView:"Grid",
    allTables:[],
    // baseData:{},

    isWaiting: false,

    toastMsg: "",

    componentsToUse:[ ],
    libraryComponents:{},

    canProceed: {
      panelApi: false,
      selectTable: false,
      componentSelection: false,
      fieldSelection: false,
      fieldSelection: false,
    }

  },

  mutations: {
    updateField,
    SELECT_VIEW: (state, payload)=>{
      state.selectedView = payload;
    },

    // Enable/disable loading spinning wheel
    SET_ISWAITING: (state, bool)=>{
      state.isWaiting = bool;
    },

    SET_TOAST_MSG: (state, msg)=>{
      state.toastMsg = msg;
    },

    SET_COMPONENT_VALUE: (state, payload) => {
      let componentsToUse = state.componentsToUse

      for(let item in componentsToUse){
        if(componentsToUse[item].listId == payload.listId){
          componentsToUse[item].comp = payload.component
          componentsToUse[item].title = payload.component.title
          componentsToUse[item].name = payload.component.name
          // componentsToUse[item].title = payload.component.title
          // componentsToUse[item].name = payload.component.name
          // componentsToUse[item].airTable = { table:"", data: {} }
          // componentsToUse[item].layers = payload.component.layers 
        }
      }

      for(let comp in componentsToUse){
        if (componentsToUse[comp].title == "") {
          state.canProceed.componentSelection = false
          return
        } else{
          state.canProceed.componentSelection = true
        }
      }

    },

    // Adds new dropdown for selection
    ADD_COMP_TO_USE: (state)=>{
      let componentsToUse = state.componentsToUse
      let len = Object.keys(componentsToUse).length - 1
      len++
      let newObj = {listId: len, title: "", name: "", comp: {}, tableData:{}}
      state.canProceed.componentSelection = false
      state.componentsToUse.push(newObj)
    },

    UPDATE_LIST:(state, payload) =>{
      console.log(payload);
      state.componentsToUse = payload.list
    },
    
    // Get a list of all components with their UID reference
    SET_COMPONENTS:(state, components) =>{
      state.libraryComponents = components
    },

    SET_COMPONENT_LIBRARY:(state, components) =>{
      state.libraryComponents = components
    },

    // Populates allTables with the name of all the tables in the database
    SET_ALL_TABLES:(state, allTables) =>{
      console.log(allTables);
      state.allTables = allTables
    },

    SET_TABLE_DATA(state, payload){
      let tableData = payload.tableData
      // let tableName = payload.tableName
      let componentName = payload.componentName
      let componentsToUse = state.componentsToUse
      let libraryComponents = state.libraryComponents
      
      for(let comp in componentsToUse){
        if(componentsToUse[comp].name == componentName){
          componentsToUse[comp].tableData = tableData
          console.log(componentsToUse[comp]);
        }
      }  

    },
    
    SET_AIRTABLE_TO_FIGMA_LAYER(state, payload){
      let componentsToUse = state.componentsToUse
      let figmaLayer = payload.figmaLayer
      let componentName = payload.componentName
      console.log(payload);
      // let airTableData = payload.tabl
      
      for(let comp in componentsToUse){
        if (componentsToUse[comp].comp.name == componentName) {
          for(let layer in componentsToUse[comp].comp.layers){
            if (componentsToUse[comp].comp.layers[layer].name == figmaLayer) {
              componentsToUse[comp].comp.layers[layer].mappedToAirTable = payload.airTableData
            }
          }
          // console.log(componentsToUse[comp].comp)
        }
      }

      // for(let comp in componentsToUse){
      //   // componentsToUse[comp].layers[figmaLayer] = componentsToUse[comp].airTable.data.recordsData[]
      //   componentsToUse[comp].layers[figmaLayer] = airTableData
      // }
    },

  },
  

  actions: {
    selectViewAction: (context, payload) =>{
      context.commit("SELECT_VIEW", payload);
    },

    setIsWaiting: (context, bool) =>{
      context.commit("SET_ISWAITING", bool)
    },

    showToast: (context, toast) => {
      context.commit("SET_TOAST_MSG", toast.msg);
      // Set what type of toast to show
      switch (toast.type) {
        case "success":
          // document.getElementById("successToast").show();
          break;
        case "error":
          // document.getElementById("errorToast").show();
          break;
        default:
          console.log("Neee");
          break;
      }
    },

    setCompToValue: (context, payload) => {
      let libraryComponents = context.state.libraryComponents
      var component = libraryComponents[payload.compTitle]
      console.log("component: ", component);
      let listId = payload.listId
      context.commit("SET_COMPONENT_VALUE", {component, listId})
    },

    addCompToUse: (context) => {
      context.commit("ADD_COMP_TO_USE")
    },

    updateList:(context, payload) =>{
      context.commit("UPDATE_LIST", payload)
      console.log(payload);
    },

    // Get a list of all components with their UID reference
    setComponents(context, components){
      context.commit("SET_COMPONENTS", components)
    },

    setComponentLibrary:(context, components)=>{
      context.commit("SET_COMPONENT_LIBRARY", components)
    },

    setAllTables:(context, allTables)=>{
      let tablesArr = []
      for(let table in allTables){
        tablesArr.push(allTables[table].fields.Name)
      }
      context.commit("SET_ALL_TABLES", tablesArr)
    },

    setTableData:(context, payload)=>{
      // let tableName = payload.tableName
      let records = payload.records
      let componentName = payload.compName

      let tableData = { 
          recordsData:{},
          fields:[]
        }

      let highestNumOfFields  = 0
      let numOfFieldsId = ""

      console.log(payload);

      for(let record in records){
        // Saves all the record's field and data into an object
        tableData.recordsData[records[record].id] = records[record].fields
        
        // Check for the record with the most fields and save its ID to a variable to get all the fields names
        let numOfFields = Object.keys(records[record].fields).length
        if (numOfFields > highestNumOfFields){
          highestNumOfFields = numOfFields
          numOfFieldsId = records[record].id
        }  
      }
      
      // // Iterate through the record with the most fields to get their field names and store them in an array
      for(let fieldName in tableData.recordsData[numOfFieldsId]){
        tableData.fields.push(fieldName)
      }

      // console.log(tableData);

      context.commit("SET_TABLE_DATA", {tableData, componentName})
    },

    setAirTableToFigmaLayer(context, payload){
      context.commit("SET_AIRTABLE_TO_FIGMA_LAYER", payload)
    }

  },  


  getters: {
    getField,
    
    getState(state){
      return state
    },

    // tableDataArr(state){
    //   return Object.keys(state.tableData)
    // },

    getCompListToUse(state){
      console.log(state.componentsToUse);
    },

    // Checks if there are any empty report component dropdowns
    // canProceedReport: state=>{
    //   let componentsToUse = state.componentsToUse
    //   let canProceed = state.canProceed

    //   for(let comp in componentsToUse){
    //     console.log(componentsToUse[comp]);
    //     if (componentsToUse[comp].title == "") {
    //       canProceed = false
    //       return
    //     } else{
    //       canProceed = true
    //     }
    //   }

    //   return canProceed
    // },
    
    usableComponents: state =>{
      let compObj = {}
      
      // Checks if the component should be editable by the user, ie: the header is present in every report and should not be shown to the user 
      for(let comp in state.libraryComponents){
        if(state.libraryComponents[comp].usable){
          compObj[comp] = state.libraryComponents[comp]
          console.log(comp);
        }
      }

      return compObj
    }
    // countRecords: state =>{
    //   return state.records.length
    // }
  }

})