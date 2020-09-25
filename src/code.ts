// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.resize(400, 600)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

// It is needed to hard-code all Library Components to be used with their key, no way to get them using the Figma Plugin API
var libraryComponents = {
  board_header: {
    key: "69f911c3a4a9b80c8181e6b1c743a3e042b8c4f8",
    name: "Board Header",
    title: "board_header",
    usable: false,
    layers: {}
  },
  hero: {
    key: "ac80f5fc2ca5cd5c456808624a205c2291e53849",
    name: "Page Hero",
    title: "hero",
    usable: true,
    layers: {}
  },
  success_chart: {
    key: "2964614bae83fc0acb205070fa6443b5ae7ed201",
    name: "Success Chart",
    title: "success_chart",
    usable: true,
    layers: {}
  },
  exec_summary: {
    key: "a9abf7679808249ff0e15c9b51bc465ce1381f0c",
    name: "Executive Summary",
    title: "exec_summary",
    usable: true,
    layers: {}
  },
  insights: {
    key: "16324faa210a930553c134d73595c7e8fcd3f87a",
    name: "Insights",
    title: "insights",
    usable: true,
    layers: {}
  },
  heading_3: {
    key: "94de7a2548bcc63a6b413a9479331fb10600a9e9",
    name: "Heading 3",
    title: "heading_3",
    usable: false,
    layers: {}
  },
  
  insights_group: {
    key: "ac9ed727b31e17131d098e724b6f597e64293d09",
    name: "Insights Group",
    title: "insights_group",
    usable: false,
    layers: {}
  },
  actions_warnings: {
    key: "9cf3eaa033b37ac19d7b291ea5630df6e4088d0f",
    name: "Actions & Warnings",
    title: "actions_warnings",
    usable: true,
    layers: {}
  },
  image_callout: {
    key: "56c9f6a3fbb36eba1b17230734df3c29017ce4f2",
    name: "Image Callout",
    title: "image_callout",
    usable: true,
    layers: {}
  }
}

function getLibraryComponents(){
  for(let comp in libraryComponents){
    
    let compKey = libraryComponents[comp].key
    figma.importComponentByKeyAsync(compKey).then((node)=>{
      
      const textNodes = node.findAll(n => n.type == "TEXT")
      
      reportComponents[node.key] = node
      
      // Look for any text layer that has the character "🔵", remove "🔵" and add it to the comp list to send to the UI.
      for(let actionable in textNodes){
        if(textNodes[actionable].name.includes("🔵")){
        
          var layerName  = textNodes[actionable].name
          var cleanLayerName = layerName

          libraryComponents[comp].layers[cleanLayerName] = {
            id: textNodes[actionable].id, 
            name: textNodes[actionable].name,
            characters: textNodes[actionable].characters,
            mappedToAirTable: ""
          }
        }
      }

      // Wait for the async import of the component and send message with components to UI
      figma.ui.postMessage({code: "setCompRef", payload: libraryComponents}) 
    });
  }
}
getLibraryComponents()

let reportComponents = {}

// Find what is the furthest element on the right X axis and get its X value
function getFurthestY(){
  let layers =  figma.currentPage.children
  let layersPosY = []
  let furthestY = ""
  
  for(let layer in layers){
    layersPosY.push(layers[layer].y+layers[layer].height)
  }
  
  var largestY = layersPosY[0]
  
  for(let y in layersPosY){
    if(largestY < layersPosY[y]){
      largestY = layersPosY[y]
    }
  }

  furthestY = largestY
  
  return largestY
}


function execSummary(){
}

function setText(textNode:object, text:string) {
  figma.loadFontAsync(textNode.fontName).then((font)=>{
    textNode.characters = text
  }).catch(err => {
    console.log("HIIIII: ", err);
    
  }) 
}

function isPrime(num) {
  for(var i = 2; i < num; i++)
    if(num % i === 0) return false;
  return num > 1;
}

figma.ui.onmessage = msg => {

  console.log(msg);
  
  if (msg.code == "closePlugin") {
    figma.closePlugin();
  }
  
  if (msg.code == "createReport") {
    // Set vars
    let componentsToUse = msg.componentsToUse;
    let allTablesData = msg.allTablesData;
    console.log("componentsToUse: ", componentsToUse);
    console.log("allTablesData: ", allTablesData);

    ////////////////////////////////////////////////////////////////
    // Create a new frame for the report page, set AutoLayout to Vertical and the width to 1440px
    let reportPage = figma.createFrame()
    reportPage.layoutMode = "VERTICAL";
    reportPage.itemSpacing = 30;
    reportPage.verticalPadding = 0;
    reportPage.resize(1440, 1)
    reportPage.fills = [{type: 'SOLID', color: {r: 0.93, g: 0.95, b: 0.97}}];;
    ////////////////////////////////////////////////////////////////
    
    // Set initial position of the reportPage
    reportPage.y = getFurthestY() + 100

    var pageComponents = {}
    
    for(let comp in componentsToUse){
      let compName = componentsToUse[comp].comp
      // Creates a new instance of the library comp and adds it to the pageComponents object,
      // Sets the AutoLayout align of the new instance to Center
      // Makes the new library comp instance a child of the page report
      function createCompNode(layoutAlign){
        pageComponents[compName] = reportComponents[componentsToUse[comp].comp.key].createInstance()
        pageComponents[compName].layoutAlign = layoutAlign
        reportPage.appendChild(pageComponents[compName])
        return pageComponents[compName]
      }
      // const textNodes = pageComponents[compName].findAll(n => n.name.includes("🔵"))

      switch (compName.title) {
        case "exec_summary":
          createCompNode("CENTER")
          for(let layer in compName.layers){
            let layerName = compName.layers[layer].name
            let airTableField = compName.layers[layer].mappedToAirTable
            let textNode = pageComponents[compName].findAll(n => n.name.includes(layerName))[0]
            
            for(let record in componentsToUse[comp].tableData.recordsData){
              let recordFields = componentsToUse[comp].tableData.recordsData[record]
              if (recordFields['Collections'] == "Executive summary") {
                let fieldText = componentsToUse[comp].tableData.recordsData[record][airTableField]
                setText(textNode, fieldText)
              }
            }
          } break;
        case "insights":
          
          // Get the value for all Collection references 
          let collectionsRef = {}
          for(let record in componentsToUse[comp].tableData.recordsData){
            let collectionRef = componentsToUse[comp].tableData.recordsData[record].Collections[0]
            for(let tableRecord in allTablesData["Collections"]){
              if(collectionRef == allTablesData["Collections"][tableRecord].id){
                collectionsRef[collectionRef] = allTablesData["Collections"][tableRecord].fields["Collections"]
              }
            }
          }
          
          function createEmptyFrame(layoutDirection, layoutAlgin, name, itemSpacing:number) {
            let newFrame = figma.createFrame()
            newFrame.resize(100, 100)
            newFrame.clipsContent = false
            newFrame.layoutAlign = layoutAlgin
            newFrame.fills = [{type: 'SOLID', color: {r: 0.93, g: 0.95, b: 0.97}, visible: false}];;
            newFrame.name = name
            newFrame.layoutMode = layoutDirection;
            newFrame.itemSpacing = itemSpacing;
            newFrame.counterAxisSizingMode = "AUTO";
            return newFrame
          }

          let insightsGroupParent = createEmptyFrame("VERTICAL", "CENTER", "Insights-Group", 82)
          insightsGroupParent.verticalPadding = 80;
          reportPage.appendChild(insightsGroupParent)
          

          for(let collection in collectionsRef){
            
            // Create Collection group
            let insightsCollection = createEmptyFrame("VERTICAL", "MIN", collectionsRef[collection], 35)
            insightsGroupParent.appendChild(insightsCollection)
            

            // Create title
            let collectionTitleNode = reportComponents["94de7a2548bcc63a6b413a9479331fb10600a9e9"].createInstance()
            insightsCollection.appendChild(collectionTitleNode)
            // console.log(collectionTitleNode);
            setText(collectionTitleNode.children[0], collectionsRef[collection])


            // Create horizontal frame wrapper for the Insights component
            let insightHorizontal = createEmptyFrame("HORIZONTAL", "MIN", "Insights-Horizontal", 35)
            insightsCollection.appendChild(insightHorizontal)
            // console.log(collection);
            let howManyInCollection = 0
            for(let record in componentsToUse[comp].tableData.recordsData){
              let collectionRef = componentsToUse[comp].tableData.recordsData[record].Collections[0]
              if (collection == collectionRef) {
                if (howManyInCollection < 2 ) {
                  let insightInstance = createCompNode("MIN")
                  insightHorizontal.appendChild(insightInstance)

                  ///// Change layer text
                  for(let layer in compName.layers){
                    let layerName = compName.layers[layer].name
                    let airTableField = compName.layers[layer].mappedToAirTable
                    let textNode = pageComponents[compName].findAll(n => n.name.includes(layerName))[0]
                    let fieldData = componentsToUse[comp].tableData.recordsData[record][airTableField]
                    
                    if (Array.isArray(fieldData) && fieldData[0].includes("rec")) {
                      let found = allTablesData[airTableField].find(element => element.id == fieldData[0])
                      let textData = found.fields[airTableField]
                      setText(textNode, textData)
                      
                    } else{
                      setText(textNode, fieldData)
                    }
                    
                  }
                }
                if (howManyInCollection + 1 > 2 ) {
                  insightHorizontal = createEmptyFrame("HORIZONTAL", "MIN", "Insights-Horizontal", 35)
                  insightsCollection.appendChild(insightHorizontal)
                  let insightInstance = createCompNode("MIN")
                  insightHorizontal.appendChild(insightInstance)
                  howManyInCollection = 0
                }
                howManyInCollection++                
              }
            }    
          } 
          break

        default:
          break;
      }

    }
  }
}
