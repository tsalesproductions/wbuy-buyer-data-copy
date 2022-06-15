function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

chrome.commands.onCommand.addListener(command => {
    // command will be "flip-tabs-forward" or "flip-tabs-backwards"
  
    chrome.tabs.query({currentWindow: true}, tabs => {
      // Sort tabs according to their index in the window.
      tabs.sort((a, b) => a.index - b.index);
      let newIndex = -1;
      if (command === 'flip-tabs-forward') {
        const checkWbuy = tabs.findIndex((tab) => tab.url.indexOf("sistemawbuy") !== -1);

        const checkAli = tabs.findIndex((tab) => tab.url.indexOf("aliexpress") !== -1);

        if(checkWbuy){
            chrome.storage.local.get(['newStorage'], function(result) {
                chrome.tabs.sendMessage(tabs[checkAli].id, {text: 'cut_aliexpress', data: result}, doStuffWithDom);
            });
            
        }
      }
    //   chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
    });
  });