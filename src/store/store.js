// TODO NEXT -> Get the layers to change for the report components.



import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';
// import records from './record-data.js';

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

    isWaiting: false,

    toastMsg: "",

    componentsToUse:[ { listId: 0, title: "", name:"" } ],
    libraryComponents:{}

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
      let toUseList = state.componentsToUse
      for(let item in toUseList){
        if(toUseList[item].listId == payload.listId){
          toUseList[item].title = payload.component.title
          toUseList[item].name = payload.component.name
          console.log(toUseList[item].name);
        }
      }
    },

    // Adds new dropdown for selection
    ADD_COMP_TO_USE: (state)=>{
      let componentsToUse = state.componentsToUse
      let len = Object.keys(componentsToUse).length - 1
      len++
      let newObj = {listId: len, title: ""}
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
    }


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
      var component = {}

      // console.log(libraryComponents[payload.compTitle]);
      component = libraryComponents[payload.compTitle]
      
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
    }

  },  


  getters: {
    getField,
    
    getState(state){
      return state
    },

    getCompListToUse(state){
      console.log(state.componentsToUse);
    },

    // Checks if there are any empty report component dropdowns
    canProceedReport: state=>{
      var componentsToUse = state.componentsToUse
      var canProceed = false

      for(let comp in componentsToUse){
        if (componentsToUse[comp].title == "") {
          canProceed = false
          return
        } else{
          canProceed = true
        }
      }
      return canProceed
    },
    
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