// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.resize(380, 440)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  let parent = this
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Get the layer's names
  if (msg.type == "find-layers"){
    var layerNamesArr = []

    // Get name of text layers
    for (const node of figma.currentPage.selection) {
      for(const child of node.children){
        if(child.type == "TEXT"){
          layerNamesArr.push(child.name)
        }
      }
    }
    
    figma.ui.postMessage({postMessage: "layerNames", layerNamesArr })
  }

  // Write data from AirTable to Figma
  if (msg.type == "updateFigamaLayers"){
      
    let card = figma.currentPage.selection[0]
    let dataLen = Object.keys(msg.data.aTData).length // Get lenght of data object
    
    let dataArray = []
    
    // Creates array with object data so that it can be iterables through indexes
    for(let item in msg.data.aTData){
      dataArray.push(msg.data.aTData[item])
    }
    
    for(var i = 1; i < dataLen; i++){  // Make however many copies of the selection
      figma.currentPage.findOne(n => n.name === card.name).clone()
      figma.currentPage.findOne(n => n.name === card.name).y += card.height + 30  
    }
    
    let allCards = figma.currentPage.findAll(n => n.name === card.name)

    function clone(val) {
      return JSON.parse(JSON.stringify(val))
    }

    // Iterate throguh the data array ->
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
