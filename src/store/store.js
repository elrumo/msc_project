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

    isWaiting: false,

    toastMsg: "",

    componentsToUse:[ { order: 0, title: "" } ],
    componentLibrary: {
      board_header: {
        key: "69f911c3a4a9b80c8181e6b1c743a3e042b8c4f8",
        name: "Board Header",
        title: "board_header",
        usable: false
      },
      hero: {
        key: "ac80f5fc2ca5cd5c456808624a205c2291e53849",
        name: "Page Hero",
        title: "hero",
        usable: true
      },
      success_chart: {
        key: "2964614bae83fc0acb205070fa6443b5ae7ed201",
        name: "Success Chart",
        title: "success_chart",
        usable: true
      },
      exec_summary: {
        key: "a9abf7679808249ff0e15c9b51bc465ce1381f0c",
        name: "Executive Summary",
        title: "exec_summary",
        usable: true
      },
      insights: {
        key: "16324faa210a930553c134d73595c7e8fcd3f87a",
        name: "Insights",
        title: "insights",
        usable: true
      },
      actions_warnings: {
        key: "9cf3eaa033b37ac19d7b291ea5630df6e4088d0f",
        name: "Actions & Warnings",
        title: "actions_warnings",
        usable: true
      },
      image_callout: {
        key: "56c9f6a3fbb36eba1b17230734df3c29017ce4f2",
        name: "Image Callout",
        title: "image_callout",
        usable: true
      }
    }

  },

  mutations: {
    updateField,
    SELECT_VIEW: (state, payload)=>{
      state.selectedView = payload;
    },

    SET_IS_WAITING: (state, bool)=>{
      state.isWaiting = bool;
    },

    SET_TOAST_MSG: (state, msg)=>{
      state.toastMsg = msg;
    },

    SET_COMPONENT_VALUE: (state, payload) => {
      console.log("order: ", payload.order);
      state.componentsToUse[payload.order].title = payload.comp.title
      state.componentsToUse[payload.order].key = payload.comp.key
    },

    // Adds new dropdown for selection
    ADD_COMP_TO_USE: (state)=>{
      let componentsToUse = state.componentsToUse
      let len = Object.keys(componentsToUse).length - 1
      len++
      let newObj = {order: len, title: ""}
      state.componentsToUse.push(newObj)
    }

  },
  

  actions: {
    selectViewAction: (context, payload) =>{
      context.commit("SELECT_VIEW", payload);
      console.log(payload);
    },

    setIsWaiting: (context, bool) =>{
      context.commit("SET_IS_WAITING", bool)
    },

    showToast: (context, toast) => {
      context.commit("SET_TOAST_MSG", toast.msg);
      // Set what type of toast to show
      // console.log(document.getElementById("successToast"));
      console.log(toast);
      switch (toast.type) {
        case "success":
          document.getElementById("successToast").show();
          break;
        case "error":
          document.getElementById("errorToast").show();
          break;
        default:
          console.log("Neee");
          break;
      }
    },

    setCompToValue: (context, payload) => {
      let comp = context.state.componentLibrary[payload.comp]
      let order = payload.order
      context.commit("SET_COMPONENT_VALUE", {comp, order})
      console.log(context.state.componentsToUse);
    },

    addCompToUse: (context) => {
      context.commit("ADD_COMP_TO_USE")
    },

  },  


  getters: {
    getField,
    
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
      for(let comp in state.componentLibrary){
        if(state.componentLibrary[comp].usable){
          compObj[comp] = state.componentLibrary[comp]
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