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
      
    let card = figma.currentPage.selection[0].name
    card = "Hi"
    
    // for(let len in msg.data.aTData){
      
    // }

      // for (const node of figma.currentPage.selection) {
      //   for(const child of node.children){
      //     for(let item in msg.data.inputFieldValues){
      //       if(child.name == msg.data.inputFieldValues[item].name){
      //         for(let data in msg.data.aTData){
      //           for(let element in msg.data.aTData[data]){
      //             if(msg.data.inputFieldValues[item].value == element){
      //               try{
      //                 figma.loadFontAsync(child.fontName).then( function(){
      //                   if(typeof msg.data.aTData[data][msg.data.inputFieldValues[item].value] == "object"){
      //                     child.characters = msg.data.aTData[data][msg.data.inputFieldValues[item].value][0]
      //                   } else{
      //                     child.characters = msg.data.aTData[data][msg.data.inputFieldValues[item].value]
      //                   }
      //                 })
      //               }catch(error){
      //                 console.log(error)
      //               }
      //             }
      //           }
      //           // if(msg.data.inputFieldValues[item].value == )
      //         }
            

      //       }
      //     }
      //   }
      // }

  }
  
  // if (msg.type == "find-layers"){
  //   // const selection = figma.currentPage.findOne(n => n.type === "GROUP") 
  //   let parent = this

  //   let card = figma.currentPage.findOne(n => n.name === "Group")
    
  //   for(var i = 0; i < msg.db.length - 1; i++){
  //     card.clone()
  //     if(card){
  //       card.name = "Group " + i
  //     }
  //     let newCard = figma.currentPage.findOne(n => n.name === "Group " + i)
  //     if(i == 0){
  //       newCard.x = 450
  //     } else{
  //       newCard.x = (i+1) * 450
  //     }
  //   }

  //   const groupNodes = figma.currentPage.findAll(n => n.type === "GROUP")
  //   for(let i = 0; i < msg.db.length; i++){
  //     for(let key in msg.db){
  //       for(let field in msg.db[key]){
  //         const textNode = parent.groupNodes[i].findOne(n => n.name === field)       
  //         try{
  //           figma.loadFontAsync(textNode.fontName).then( function(){
  //             textNode.characters = msg.db[i][field]
  //           })
  //         }catch(error){
  //           console.log(error)
  //         }
  //       }
  //     }
  //   }
  // }

  if (msg.type == "closePlugin"){
    closePlugin()
  }

  function closePlugin(){
    figma.closePlugin();
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
};
