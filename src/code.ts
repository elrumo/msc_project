// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.resize(380, 480)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
let componentsInUse = { layers:{}, components:{} }
let instances = []
let newPages = []
let furthestX = ""
let currentPageReport = "Executive Summary"
let exec_page = {}

let pageWidth = 1440
let pageHeight = 3000

figma.ui.onmessage = msg => {

  // Find what is the furthest element on the right X axis and get its X value
  function getFurthestX (){
    let layers =  figma.currentPage.children
    let layersPosX = []
    
    for(let layer in layers){
      layersPosX.push(layers[layer].x)
    }
    
    var largestX = layersPosX[0]
    
    for(let x in layersPosX){
      if(largestX < layersPosX[x]){
        largestX = layersPosX[x]
      }
    }

    furthestX = largestX
    
    return largestX
  }

  function createNewFrame(name, x, y, w, h){
    let newFrameId = figma.createFrame().id
    let newFrame = figma.currentPage.findOne(n => n.id === newFrameId)    
    
    newFrame.name = name
    
    if (x) {
      newFrame.x = x
    }
    if (y) {
      newFrame.y = y
    }
    newFrame.resize(w, h)
    
    return newFrame
  }
  // Create page report with name "Executive Summary"
  function createPageReport(){

    let newFrameId = figma.createFrame().id
    let newFrame = figma.currentPage.findOne(n => n.id === newFrameId)    
    
    newFrame.name = "Executive Summary"
    newFrame.x = getFurthestX() + pageWidth + 200
    newFrame.fills = [{type: 'SOLID', color: {r: 0.93, g: 0.95, b: 0.97}}];
    newFrame.resize(pageWidth, pageHeight)
    newPages.push({
      name: newFrame.name,
      id: newFrameId,
      node: newFrame
    })
    
    return newFrame
  }

  function newInstance(component, node){
    // Creates new instance of component
    componentsInUse.components[component] = node
    componentsInUse.layers[component] = []
    
    // Find all text layers
    for(const child of componentsInUse.components[component].children){
      if(child.type == "TEXT"){
        componentsInUse.layers[component].push(child.name)
      }
    }
    // Revers order so that it shows top to bottom layers
    componentsInUse.layers[component].reverse()
  }

  function clone(val) {
    return JSON.parse(JSON.stringify(val))
  }

  // Get components from the Figma library, the number below is the key from the Insights card.
  if (msg.type == "fetchComponentCards"){
    // Iterate through the object received with the type of cards to use
    function findComponents(){
      for(let card in msg.cardsToUse){
        switch (msg.cardsToUse[card].value) {
          case "insights":
            // Adds the library component to the componentsInUse arr & gets text layers to send them over to the Vue app.
            figma.importComponentByKeyAsync("16324faa210a930553c134d73595c7e8fcd3f87a").then((node)=>{
              newInstance("insights", node)
            });
            break;
          case "exec_summary":
            // Adds the library component to the componentsInUse arr & gets text layers to send them over to the Vue app.
            figma.importComponentByKeyAsync("a9abf7679808249ff0e15c9b51bc465ce1381f0c").then((node)=>{
              newInstance("exec_summary", node)
          });
            break;
          default:
              console.log("No components selected or found");
            break;
        }
      }

      // Get text layers and send them over to the Vue app.
      setTimeout(function(){
        figma.ui.postMessage({postMessage: "layerNames", componentsInUse })
      }, 100)

    }

    findComponents()
    // findLayers()
  }


  if (msg.type == "updateFigmaLayers"){
    // Create page report
    let newPage = createPageReport()
    exec_page.pageNode = newPage
    var topicFrame

    exec_page.topics = {}
    for(const component in componentsInUse.components){
      switch (component) {
        case "insights":
          figma.importComponentByKeyAsync("16324faa210a930553c134d73595c7e8fcd3f87a").then((insightsNode)=>{
            // Creates new instance of component & gets text layers and send them over to the Vue app.
            // TODO: Cluster all cards with the same topic
            let num = 0
            let paddingCards = 52
            let topicPaddingBottom = 60
            let lastFrameNodeY = ""
            let lastTopicFrame = []

            // Create a new frame for each topic
            for(const i in msg.data.topicsTable){
              let topic = msg.data.topicsTable[i].topic
              let topicId = msg.data.topicsTable[i].id

              topicFrame = createNewFrame(topic, 0, 0, pageWidth, insightsNode.height+paddingCards+topicPaddingBottom+50)
              newPage.appendChild(topicFrame)
              // Sets background transparency of new frame to 0%
              fills = clone(topicFrame.fills)
              fills[0].opacity = 0
              topicFrame.fills = fills

              // Set location of topic frame nodes
              if(lastFrameNodeY == ""){
                topicFrame.y = 650
                lastFrameNodeY = topicFrame.y + topicFrame.height
              } else{
                topicFrame.y = lastFrameNodeY
                lastFrameNodeY = topicFrame.y + topicFrame.height
              }
              
              // Create Topic group title text
              figma.importComponentByKeyAsync("6a821d6b7ec1f468dda01de1a86e8fc8ca5e3ebe").then((nodeText)=>{
                let topicHeading = nodeText.createInstance()
                
                exec_page.topics[topicId].frameNode.appendChild(topicHeading)
                topicHeading.x = (pageWidth - (insightsNode.width*2 + paddingCards ))/2

                try{
                  figma.loadFontAsync(topicHeading.children[0].fontName).then( function(){
                    topicHeading.children[0].characters = topic
                  })
                }catch(error){
                  console.log(error)
                }
              }).then(function createInsights() {

                // Create "Insight" cards based on library component.
                let topicGroupFrame = exec_page.topics[topicId]
                var gridCards = 0

                let lastInsightY = topicPaddingBottom
                let lastInsightYright = topicPaddingBottom

                for(const card in msg.data.aTData){
                  // Check if data has same Topic as group, if so, make it child of the group
                  if(msg.data.aTData[card].Topic !== undefined && msg.data.aTData[card].Topic[0] == topicId){
                  
                    // Create new instance of library component 
                    let insightInstance = componentsInUse.components.insights.createInstance()
                    topicGroupFrame.frameNode.appendChild(insightInstance)

                    // Set position of Insight card within the Topic group
                    function setPositionCard() {
                      // Set position of insight cards within the Topic group
                      if (gridCards % 2 == 0) {
                        insightInstance.x = (pageWidth - ((insightInstance.width * 2) + paddingCards ))/2
                        insightInstance.y = lastInsightY
                        lastInsightY = insightInstance.y + insightInstance.height + paddingCards
                        //  Change Topic group frame's height to match the inner content
                        topicGroupFrame.frameNode.resize(1440, lastInsightY)
                        
                      } else if (gridCards % 2 != 0) {
                        insightInstance.x = (pageWidth - ((insightInstance.width * 2) ))/2 + insightInstance.width
                        insightInstance.y = lastInsightYright
                        lastInsightYright = lastInsightY
                      }
                      // Layout newly crated insight cards properly
                        // then ->>
                      //  height and y position of Topic group based on inner child components i.e. The insight cards
                    }
                    // Change text fields with AirTable data
                    function updateFigmaText() {
                      for(const input in msg.data.inputFieldValues.insights){
                        let tableField = msg.data.inputFieldValues.insights[input]
                        let layerToChange = insightInstance.findChildren(n => n.name === input)[0]
                        let airtData = msg.data.aTData[card][tableField]
                        
                        try{ figma.loadFontAsync(layerToChange.fontName).then( function(){
                            // Check type of AirTable data received
                            switch (typeof airtData) {
                              case "object":
                                for(const obj in airtData){
                                  // If atFieldValue[obj] is also an object, it will be also be an image
                                  if(typeof airtData[obj] == "object"){
                                    layerToChange.characters = airtData[obj].url 
                                  }else{
                                    layerToChange.characters = airtData[obj];
                                  }
                                }
                                break;
                              case "string":
                                layerToChange.characters = airtData
                              default:
                                break;
                            }
                          })
                        }catch(error){
                          console.log(error)
                        }
                      }
                    }
                    // Change colour of bars
                    function changeColourBars() {
                      const importanceBar = insightInstance.findChildren(n => n.name === "importance-bar")[0];
                      if(msg.data.aTData[card]["Insight type"] == "Positive"){
                        for(const bar in importanceBar.children){
                          const fills = clone(importanceBar.children[bar].fills)
                          fills[0].color.r = 79 /255
                          fills[0].color.g = 201 /255
                          fills[0].color.b = 126 /255
                          importanceBar.children[bar].fills = fills
                        }
                      }
                      if(msg.data.aTData[card]["Insight type"] == "Caution"){
                        for(const bar in importanceBar.children){
                          let fills = clone(importanceBar.children[bar].fills)
                          if(importanceBar.children[bar].name == "high") {
                            fills[0].color.r = 254 /255
                            fills[0].color.g = 236 /255
                            fills[0].color.b = 198 /255
                            importanceBar.children[bar].fills = fills
                          }else{
                            fills[0].color.r = 253 /255
                            fills[0].color.g = 190 /255
                            fills[0].color.b = 65 /255
                            importanceBar.children[bar].fills = fills
                          }
                        }
                      }
                      if(msg.data.aTData[card]["Insight type"] == "Concerning"){
                        for(const bar in importanceBar.children){
                          const fills = clone(importanceBar.children[bar].fills)
                          if(importanceBar.children[bar].name == "low") {
                            fills[0].color.r = 255 /255
                            fills[0].color.g = 108 /255
                            fills[0].color.b = 126 /255
                            importanceBar.children[bar].fills = fills
                          }else{
                            fills[0].color.r = 255 /255
                            fills[0].color.g = 211 /255
                            fills[0].color.b = 216 /255
                            importanceBar.children[bar].fills = fills
                          }
                        }
                      }
                    }

                    setPositionCard()
                    updateFigmaText()
                    changeColourBars()
                    gridCards++ 
                  }

                }
                
                // Set the new y position of the Topic frames based on the content inside.
                if (lastTopicFrame.frameNode) {
                  topicGroupFrame.frameNode.y = lastTopicFrame.frameNode.height + lastTopicFrame.frameNode.y + paddingCards
                  console.log(topicGroupFrame.frameNode.y);
                  
                }
                lastTopicFrame = topicGroupFrame
                
                // Set new height for the page node based on its content.
                let newPageHeight = topicGroupFrame.frameNode.y + topicGroupFrame.frameNode.height + 200  
                exec_page.pageNode.resize(pageWidth, newPageHeight)
              })
              
              // Add the each new Topics frame as a child to the exec_page.topics object
              exec_page.topics[msg.data.topicsTable[i].id] = {
                frameNode: topicFrame,
                name: topicFrame.name,
                id: msg.data.topicsTable[i].id,
                nodes: {}
              }
              
            }
          });
          break;
        case "exec_summary":
          figma.importComponentByKeyAsync("a9abf7679808249ff0e15c9b51bc465ce1381f0c").then((node)=>{
            // Creates new instance of component & gets text layers and send them over to the Vue app.
            let execSummaryInstance = componentsInUse.components.exec_summary
            let newExecSummary = execSummaryInstance.createInstance()

            instances.push(newExecSummary)

            let currentNode

            newPage.appendChild(newExecSummary)
            

            for(const page in newPages){
              if(newPages[page].name == "Executive Summary"){
                for(const instance in instances){
                  if(instances[instance].name == "pages/exec_summary/hero"){
                    // instances[instance].x = newPages[page].node.x
                    currentNode = instances[instance]
                    console.log("currentNode: ", currentNode);
                    
                  }
                }
              }
            }
            const textNodes = currentNode.findChildren(n => n.type === "TEXT");        
            // Write user input description to layer
            for(let text in textNodes){
              if(textNodes[text].name == "description-text"){
                console.log("text.name: ",textNodes[text].name);
                try{
                  figma.loadFontAsync(textNodes[text].fontName).then( function(){
                    textNodes[text].characters = msg.data.inputFieldValues.exec_summary.pageDescription
                  })
                }catch(error){
                  console.log(error)
                }
              }
            }     
            // Get current node height
            // console.log(currentNode);
          });

          break;
        default:
            console.log("No components selected or found");
          break;
      }

    }
  }

  if (msg.type == "updateFigmaLayers2"){
    
    // createPageReport()

    // let card = figma.currentPage.selection[0]
    // let dataLen = Object.keys(msg.data.aTData).length // Get length of data object
    
    // let dataArray = []
    
    // // Creates array with object data so that it can be iterated through indexes
    // for(let item in msg.data.aTData){
    //   dataArray.push(msg.data.aTData[item])
    // }
    
    // for(var i = 1; i < dataLen; i++){  // Make however many copies of the selection
    //   figma.currentPage.findOne(n => n.name === card.name).clone()
    //   figma.currentPage.findOne(n => n.name === card.name).y += card.height + 30  
    // }
    
    // let allCards = figma.currentPage.findAll(n => n.name === card.name)

    // Iterate through the data array ->
      // All newly crated cards         -> 
        //  Field inputs                  -> 
    for(let dbEntry in dataArray ){
      for(const child of allCards[dbEntry].children){
        
        if(child.name == "importance-bar"){
          for(let bar in child.children){
            if(dataArray[dbEntry]["Insight type"] == "Positive"){
              // console.log("Positive");
              const fills = clone(child.children[bar].fills)
              fills[0].color.r = 79/255
              fills[0].color.g = 201/255
              fills[0].color.b = 126/255
              child.children[bar].fills = fills
              // console.log(child.children[bar].fills);
            }

            if(dataArray[dbEntry]["Insight type"] == "Neutral"){
              // console.log("Positive");
              const fills = clone(child.children[bar].fills)
              fills[0].color.r = 196/255
              fills[0].color.g = 196/255
              fills[0].color.b = 196/255
              child.children[bar].fills = fills
              // console.log(child.children[bar].fills);
              
            }
            
            if(dataArray[dbEntry]["Insight type"] == "Caution"){
              // console.log("Caution");
              if(child.children[bar].name == "high" ){
                var fills = clone(child.children[bar].fills)
                fills[0].color.r = 254/255
                fills[0].color.g = 236/255
                fills[0].color.b = 198/255
                child.children[bar].fills = fills
              }
              if(child.children[bar].name == "mid" ||  child.children[bar].name == "low"){
                var fills = clone(child.children[bar].fills)
                fills[0].color.r = 253/255
                fills[0].color.g = 190/255
                fills[0].color.b = 65/255
                child.children[bar].fills = fills
              }
            }

            if(dataArray[dbEntry]["Insight type"] == "Concerning"){
              // console.log("Caution");
              if(child.children[bar].name == "high" || child.children[bar].name == "mid" ){
                var fills = clone(child.children[bar].fills)
                fills[0].color.r = 247/255
                fills[0].color.g = 214/255
                fills[0].color.b = 218/255
                child.children[bar].fills = fills
              }
              if(  child.children[bar].name == "low"){
                var fills = clone(child.children[bar].fills)
                fills[0].color.r = 247/255
                fills[0].color.g = 137/255
                fills[0].color.b = 151/255
                child.children[bar].fills = fills
              }
            }
            
            // fills[0].color.r = 0.5
            // child.children[bar].fills = fills
          
            }
          }
        for(let item in msg.data.inputFieldValues){
          if(child.name == msg.data.inputFieldValues[item].name){
            for(let element in dataArray[dbEntry]){
              if(msg.data.inputFieldValues[item].value == element){;
                try{
                  figma.loadFontAsync(child.fontName).then( function(){
                    if(typeof dataArray[dbEntry][element] == "object"){
                      child.characters = dataArray[dbEntry][element][0]
                    } else{
                      child.characters = dataArray[dbEntry][element]
                    }
                  })
                }catch(error){
                  console.log(error)
                }
              }
            }
          }
        }
      }
    }

  }




  if (msg.type == "closePlugin"){
    closePlugin()
  }


  function closePlugin(){
    figma.closePlugin();
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
};
