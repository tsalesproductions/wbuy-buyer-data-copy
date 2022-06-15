chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'cut_aliexpress') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        let data = JSON.parse(msg.data.newStorage);

        document.querySelector("#contactPerson").value = data.name
        document.querySelector("#mobileNo").value = data.phone
        document.querySelector("#address").value = data.ad_rua
        document.querySelector("#address2").value = data.ad_complemento
        document.querySelector("#zip").value = data.ad_cep
        document.querySelector("#cpf").value = data.docnumber

        sendResponse("OK")
        alert("Colado")
        
        // console.log(document.all[0].outerHTML)
        // sendResponse(document.all[0].outerHTML);
    }
});

window.addEventListener('keypress', (e) => {
    function copyToClip(data) {
        // let input = document.createElement("textarea");
        // input.value = data;
        // document.body.appendChild(input);
        // input.select();
        // document.execCommand("Copy");
        // input.remove();

        // chrome.storage.local.set({
        //     'newStorage': data
        // });

        chrome.storage.local.set({newStorage: data}, function() {
            alert("Copiado")
        });
    }

    async function getClipboard() {
        function command(){
            chrome.storage.local.get(['newStorage'], function(result) {
                console.log('Copiado');
            });
        }

        const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
        const permissionStatus = await navigator.permissions.query(queryOpts);

        if(permissionStatus.state === 'granted') return command();

        permissionStatus.onchange = () => {
            if(permissionStatus.state !== 'granted') return getClipboard();
        };
        
        // browser.runtime.sendMessage({
        //     cmd: "clipboard", //$NON-NLS-0$
        //     action: "paste" //$NON-NLS-0$
        // }, function(response) {
        //     console.log(response)
        // });
    };
    
    function copiar(){
        let clientData = document.querySelectorAll("#blocos > div.item")
        if(clientData.length === 0) return alert("Div onde estão localizados os dados não foi encontrada");
            clientData = clientData[0].querySelectorAll("p");
        if(clientData.length === 0) return alert("Textos onde estão os dados do usuário não encontrado");
        

        let clientAddrees = document.querySelectorAll("#blocos > div.item")
        if(clientAddrees.length === 0) return alert("Div onde estão localizados o endereço não foi encontrada");
            clientAddrees = clientAddrees[1].querySelectorAll("p");
        if(clientAddrees.length === 0) return alert("Textos onde estão o endereço não encontrado");

        const data = {
            name: clientData[2].innerText.trim(),
            docnumber: clientData[3].innerText.trim().replace("CPF: ","").replace("CPF:",""),
            email: (clientData[6].innerText.trim().indexOf("@") !== -1 ? clientData[6].innerText.trim() : clientData[7].innerText.trim()),
            phone: (clientData[7].innerText.trim().indexOf("(") !== -1 ? clientData[7].innerText.trim().replace("(","").replace(")","").replace("-","") : clientData[8].innerText.trim().replace("(","").replace(")","").replace("-","")),
            ad_rua: clientAddrees[1].innerText.trim().split(' - ')[0],
            ad_complemento: clientAddrees[1].innerText.trim().split(' - ')[1],
            ad_street: (clientAddrees[1].innerText.trim().split(' - ')[2].indexOf("CEP") !== -1 ? '' : clientAddrees[1].innerText.trim().split(' - ')[2]),
            ad_cep: clientAddrees[1].innerText.trim().split(' - ')[clientAddrees[1].innerText.trim().split(' - ').length - 2].replace("CEP: ",''),
            ad_state_city: clientAddrees[1].innerText.trim().split(' - ')[clientAddrees[1].innerText.trim().split(' - ').length - 1]
        }

        copyToClip(JSON.stringify(data));
    }

    function colar(){
        console.log("colar");
        getClipboard();
    }

    // if(e.code === "NumpadSubtract"){
    //     colar();
    // }

    if(e.code === "NumpadAdd"){
        copiar();
    }
})