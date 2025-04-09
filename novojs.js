// Função para aguardar a existência de um elemento
function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 100);
}

// Exemplo de uso: Espera o elemento "#transfere_negocio"
waitForElement("#transfere_negocio", (element) => {
  console.log('Elemento encontrado:', element);

  (function initApp() {
    // Funções de busca e manipulação:
    busca_produto();
    busca_usuarios();

    const produto = document.querySelectorAll('.produto');
    const SelectsDeEtapa = document.querySelectorAll('#etapa-funil');
    const etapas = document.querySelectorAll('.etapa');
    const sections = {
      'PROSPECÇÃO': 'prospect',
      'NEGOCIAÇÃO': 'deal',
      'EXECUÇÃO': 'execut',
      'REPESCAGEM': 'repesca'
    };

    // Função para tratar a mudança da etapa
    function handleEtapaChange(etapaSelect) {
      // Caso o evento seja de input, obtenha o currentTarget
      if (etapaSelect instanceof Event) {
        etapaSelect = etapaSelect.currentTarget;
      }
      // Esconde todas as seções
      Object.values(sections).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.classList.remove('visivel');
      });

      // Obtém o valor selecionado e o valor do produto no mesmo pai
      const selectedValue = etapaSelect.value;
      const valorProduto = etapaSelect.parentElement.querySelector('.produto').value;
      SelectsDeEtapa.forEach(selectElem => {
        selectElem.value = selectedValue;
        selectElem.parentElement.querySelector('.produto').value = valorProduto;
      });

      // Mostra a seção correspondente
      const sectionToShow = sections[selectedValue];
      if (sectionToShow) {
        document.getElementById(sectionToShow).classList.add('visivel');
      }
      
      // Chamada de função condicional para produtos
      if (selectedValue === 'REPESCAGEM') {
        busca_produto(true);
      } else {
        busca_produto();
      }

      // Atualiza o step de visualização conforme a etapa selecionada
      if (selectedValue === 'PROSPECÇÃO') {
        showStep(10);
      } else if (selectedValue === 'NEGOCIAÇÃO') {
        showStep(15);
      } else if (selectedValue === 'EXECUÇÃO') {
        showStep(21);
      } else if (selectedValue === 'REPESCAGEM') {
        showStep(25);
      }
    }

    // Adiciona o event listener para cada select de etapa
    SelectsDeEtapa.forEach(selectElem => {
      selectElem.addEventListener('input', handleEtapaChange);
    });

    // Função para ajustar o grid de etapas conforme o tamanho da tela
    function tamanhoPagina() {
      const viewportWidth = window.innerWidth;
      const sidebarPercentage = Math.round((150 / viewportWidth) * 100);
      const conteudoPercentage = 100 - sidebarPercentage;
      etapas.forEach(etapa => {
        etapa.style.gridTemplateColumns = `${sidebarPercentage}vw ${conteudoPercentage}vw`;
      });
    }
    window.addEventListener('resize', tamanhoPagina);

    // Função fetchProductData com uso de createElement para atualizar selects
    async function fetchProductData(productNumber, etapa) {
        // Verifica token de autenticação (exemplo)
        const isAuthenticated = true;
        const isAuthenticatedExpiration = localStorage.getItem('isAuthenticatedExpiration');
        if (!isAuthenticated || (isAuthenticatedExpiration && Date.now() >= parseInt(isAuthenticatedExpiration))) {
            window.location.href = '/login.html';
            return;
        }
        
        // Ajusta a altura do body se necessário
        function adjustBodyHeight() {
            if (document.body.clientHeight <= 300) {
            document.body.style.height = '530px';
            } else {
            document.body.style.width = '100vw';
            }
        }
        window.addEventListener('resize', adjustBodyHeight);

        

      // Exemplo de manipulação de mapa (se aplicável)
        const myNewHeaders = new Headers();
        myNewHeaders.append("Accept", "application/json");
        myNewHeaders.append("Cookie", "__cf_bm=53xTQMNzJON7e57.ajQe4QtpGRX8qhWEI294.g0i19U-1705091606-1-AXDZgBWC0wYYJTVs/2CoTc873goN1Q9Br1gyIMJtAag5Qq9YT2faO8X/lgOhW96NiV5sVrGScT4PwMpQIA8ka4M=");
        
        var NewrequestOptions = {
        method: 'GET',
        headers: myNewHeaders,
        redirect: 'follow'
        };
        
        try {
        const response = await fetch(`https://api.pipedrive.com/v1/products/${productNumber}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, NewrequestOptions);
        const responseData = await response.json();
        const mapaResponse = await fetch('https://weriqui.github.io/extencaoscript/mapa.json');
        if (!mapaResponse.ok) {
            throw new Error('Falha ao obter o mapa');
        }
        const mapaData = await mapaResponse.json();
        const mapa = mapaData;
      
        const limpar = Object.values(mapa);
        for (let i = 0; i < limpar.length; i++) {
            const element = document.getElementById(limpar[i]);
            if(element){
            element.innerHTML = ''
            }
        }
        Object.entries(mapa).forEach(([key, value]) => {
            const scriptText = responseData.data[key];
            if (scriptText) {
            const formattedText = scriptText.replace(/\n\n/g, '\n').replace(/\n/g, '<br><br>').replace(/XXXXXXXXXX/g,'<strong>XXXXXXXXXX</strong>').replace(/XXXXXXXXX/g,'<strong>XXXXXXXXX</strong>').replace(/XXXXXXXX/g,'<strong>XXXXXXXX</strong>').replace(/XXXXXXX/g,'<strong>XXXXXXX</strong>').replace(/XXXXXX/g,'<strong>XXXXXX</strong>').replace(/XXXXX/g,'<strong>XXXXX</strong>').replace(/XXXX/g,'<strong>XXXX</strong>').replace(/XXX/g,'<strong>XXX</strong>');
            const element = document.getElementById(value);
            if (element) {
                element.innerHTML = formattedText;
            }
            }
        });
      
        for (let i = 1; i <= totalSteps; i++) {
            const stepEl = document.getElementById('step' + i);
            if (stepEl) {
            stepEl.addEventListener('click', () => showStep(i));
            }
        }
      
        showStep(etapa);
          
        } catch (error) {
            console.log('error', error);
        }
        // Adiciona a lógica para bind de eventos aos steps
        for (let i = 1; i <= totalSteps; i++) {
            const stepEl = document.getElementById('step' + i);
            if (stepEl) {
            stepEl.addEventListener('click', () => showStep(i));
            }
        }
        showStep(etapa);
    }
    fetchProductData(produto[0].value, 10);

    // Atualiza quando algum select de produto tem input
    produto.forEach(produto_clicado => {
      produto_clicado.addEventListener('input', function(event){
        const numero_produto = event.currentTarget.value;
        fetchProductData(numero_produto, parseInt(document.querySelectorAll('.step-content:not(.hidden)')[0].id.split('-')[1]));
      });
    });

    handleEtapaChange(document.querySelector('#etapa-funil'));
    tamanhoPagina();
  })();

  // Bloco de copy para parágrafos com class "red"
  (function() {
    const redParagraphs = document.querySelectorAll('p.red');
    redParagraphs.forEach(p => {
      p.addEventListener('click', function() {
        let confirmation = p.querySelector('.copy-confirmation');
        if (!confirmation) {
          confirmation = document.createElement('span');
          confirmation.classList.add('copy-confirmation');
          confirmation.textContent = 'Copiado!';
          p.appendChild(confirmation);
        }
        let textToCopy = p.innerHTML
          .replace(/<br>/g, '\n')
          .replace(/<[^>]*>/g, '')
          .replace('Copiado!', '')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '');
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            confirmation.classList.add('show-confirmation');
            setTimeout(() => {
              confirmation.classList.remove('show-confirmation');
            }, 2000);
          })
          .catch(err => {
            console.error('Erro ao copiar texto:', err);
          });
      });
    });
  })();

  // Modal para consulta de telefone e transferência de negócio
  (function() {
    document.querySelector("#consulta_telefone").addEventListener('click', function(){
      let numero = document.querySelector("#pesquisa_telefone").value;
      pesquisaTelefone(numero);
      if (document.querySelector("#Agente").value === '') {
        const modal = document.querySelector('dialog');
        modal.innerHTML = '<h1>Selecione o Assessor</h1> <button>OK</button>';
        const buttonClose = modal.querySelector("button");
        buttonClose.onclick = function () {
          modal.close();
          modal.innerHTML = '';
        }
        modal.showModal();
      }
      document.querySelector("#transfere_negocio")
        .addEventListener('click', converter_lead_em_negocio);
    });
  })();

});

// Definir o total de steps
const totalSteps = 50;
async function showStep(stepNumber) {
  for (let i = 0; i <= totalSteps; i++) {
    const el = document.getElementById('etapa-' + i);
    if (el) {
      el.classList.add('hidden');
    }
  }
  const currentEl = document.getElementById('etapa-' + stepNumber);
  if (currentEl) {
    currentEl.classList.remove('hidden');
  }
}

function createTableFromJson(jsonData) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  const chavesSelecionadas = ["DATA_REQUERIMENTO", "NUMERO_CONTA", "TIPO_PARCELAMENTO", "MODALIDADE", "SITUACAO", "QNT_PARCELAS", "QNT_PARCELAS_ATRASADAS", "VALOR_CONSOLIDADO", "VALOR_PINCIPAL"];

  jsonData.forEach(function (item) {
    const novoObjeto = {};
    chavesSelecionadas.forEach(chave => {
      novoObjeto[chave] = item[chave];
    });
    const row = document.createElement('tr');
    for (const key in novoObjeto) {
      if (key !== '_id') {
        const cell = document.createElement('td');
        cell.setAttribute('data-label', key.toUpperCase());
        cell.textContent = novoObjeto[key];
        row.appendChild(cell);
      }
    }
    tableBody.appendChild(row);
  });
}

function getAccessToken(forceRenew = false) {
  const loginUrl = 'https://realm.mongodb.com/api/client/v2.0/app/data-jqjrc/auth/providers/local-userpass/login';
  const credentials = {
    username: "weriquetiao@gmail.com",
    password: "admin123"
  };

  if (!forceRenew && localStorage.getItem('accessToken')) {
    return Promise.resolve(localStorage.getItem('accessToken'));
  }
  return fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('accessToken', data.access_token);
    return data.access_token;
  })
  .catch(error => {
    console.error('Erro ao obter token:', error);
    throw error;
  });
}

function find(consulta) {
  const findOneUrl = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-jqjrc/endpoint/data/v1/action/find';
  const requestData = {
    "collection": "par-pf",
    "database": "base-parcelamentos",
    "dataSource": "password",
    "filter": { 'CPF': consulta }
  };

  function attemptFind(accessToken) {
    return fetch(findOneUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestData)
    });
  }

  function handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return getAccessToken(true).then(attemptFind);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      return response.json();
    }
  }

  getAccessToken()
    .then(attemptFind)
    .then(handleResponse)
    .then(data => {
      createTableFromJson(data.documents);
      document.querySelector("#par").style.display = data.documents.length === 0 ? 'none' : 'block';
    })
    .catch(error => {
      console.error('Failed to find', error);
    });
}

function findpj(consulta) {
  const findOneUrl = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-jqjrc/endpoint/data/v1/action/find';
  const requestData = {
    "collection": "par-pj",
    "database": "base-parcelamentos",
    "dataSource": "password",
    "filter": { 'CPFCNPJDOOPTANTE': consulta }
  };

  function attemptFind(accessToken) {
    return fetch(findOneUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestData)
    });
  }

  async function handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return getAccessToken(true).then(attemptFind);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      const pre_resposta = await response.json();
      if (!pre_resposta.documents || pre_resposta.documents.length === 0) return [];
      const resposta = pre_resposta.documents.map(dict => {
        const mappedPar = {};
        Object.keys(dict).forEach(key => {
          if (mapa_par_pj[key]) {
            mappedPar[mapa_par_pj[key]] = dict[key];
          }
        });
        return mappedPar;
      });
      return resposta;
    }
  }

  getAccessToken()
    .then(attemptFind)
    .then(handleResponse)
    .then(data => {
      if (data.length === 0) {
        document.querySelector("#par").style.display = 'none';
      } else {
        createTableFromJson(data);
        document.querySelector("#par").style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Failed to find', error);
    });
}

function formatarCPF(cpf) {
  if (cpf.slice(0,3) === "XXX") {
    return cpf;
  } else {
    let cpfLimpo = cpf.replace(/\D/g, '');
    return 'XXX.' + cpfLimpo.slice(3, 6) + '.' + cpfLimpo.slice(6, 9) + '-XX';
  }
}

function copyPageContent() {
  let container = document.querySelector('#card');
  let confirmation = container.querySelector('.copy-confirmation');
  if (!confirmation) {
    confirmation = document.createElement('span');
    confirmation.classList.add('copy-confirmation');
    confirmation.textContent = 'Copiado!';
    container.appendChild(confirmation);
  }
  window.getSelection().selectAllChildren(container);
  
  try {
    const success = document.execCommand('copy');
    if (success) {
      confirmation.classList.add('show-confirmation');
      setTimeout(() => {
        confirmation.classList.remove('show-confirmation');
      }, 2000);
    } else {
      console.error('Erro ao copiar texto');
    }
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
  }
}

function filtrar_transferir_negocio(dado) { 
  return {
    "id": dado.data[0].id,
    "nome": dado.data[0].person_id.name,
    "telefone": dado.data[0].person_id.phone[0].value,
    "empresa": dado.data[0].org_id.name
  };
}

async function arquiva(id) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  
  let raw = JSON.stringify({ "is_archived": true });
  let requestOptions = { method: 'PATCH', headers: myHeaders, body: raw, redirect: 'follow' };
  
  fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  return;
}

async function pesquisar_leads(id) {
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  let requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  const result = await response.json();
  return result.data;
}

async function converter_lead_em_negocio() {
  const modal = document.querySelector('dialog');
  modal.innerHTML = '<img src="https://usagif.com/wp-content/uploads/loading-63.gif" alt="">';
  modal.style.backgroundColor = 'transparent';
  modal.style.border = 'none';
  modal.showModal();
  document.querySelector('.conteudo').style.opacity = '30%';
  
  const id_lead = document.querySelector("#nome_da_pessoa").idpipe;
  const titulo = document.querySelector("#empresa_da_pessoa").innerText;
  const user_id = document.querySelector("#Agente").value;
  const negocio_criado = await criarNegocio(id_lead, user_id);
  
  if (negocio_criado <= 299) {
    const deletar_o_lead = await deletar_lead(id_lead);
    if (deletar_o_lead <= 299) {
      const arquivar_leads = await buscar_e_arquivar_leads(titulo);
      if (arquivar_leads <= 299) {
        modal.style.backgroundColor = 'white';
        modal.style.border = 'black 1px solid';
        modal.innerHTML = '<h1>Negócio Criado Com Sucesso</h1> <button>OK</button>';
        const buttonClose = modal.querySelector("button");
        buttonClose.onclick = function () {
          modal.close();
          modal.innerHTML = '';
          document.querySelector('.conteudo').style.opacity = '100%';
        }
      } else {
        alert("Erro ao arquivar os Leads");
      }
    } else {
      alert("Erro ao deletar o Lead");
    }
  } else {
    alert("Erro ao criar o negócio");
  }
}

async function buscar_e_arquivar_leads(org_name) {
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  let requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/search?term=${org_name}&exact_match=1&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  const result = await response.json();
  console.log(result);
  const bl = await envia_python(result);
  console.log(bl);
  for (let i = 0; i < result.data.items.length; i++) {
    id = result.data.items[i].item.id;
    arquiva(id);
  }
  return response.status;
}

async function deletar_lead(id) {
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  let requestOptions = { method: 'DELETE', headers: myHeaders, redirect: 'follow' };
  
  const reponse = await fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  return reponse.status;
}

async function criarNegocio(id, user_id) {
  const dados_lead = await pesquisar_leads(id);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  
  let raw;
  if (dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"] == "292") {
    raw = JSON.stringify({
      "title": dados_lead["title"],
      "value": null,
      "expected_close_date": null,
      "user_id": user_id,
      "person_id": dados_lead["person_id"],
      "org_id": dados_lead["organization_id"],
      "next_activity_id": null,
      "5fca6336de210f847b78ce5fd7de950530e26e94": dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb": dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency": dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf": dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency": dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency"],
      "829d91cab91f6709555655e9e9a6289090407f0d": dados_lead["829d91cab91f6709555655e9e9a6289090407f0d"],
      "829d91cab91f6709555655e9e9a6289090407f0d_currency": dados_lead["829d91cab91f6709555655e9e9a6289090407f0d_currency"],
      "7f58a030551b0e72f14542f150980a167b77444a": dados_lead["7f58a030551b0e72f14542f150980a167b77444a"],
      "9774abceca413e202f5ae99db37af307340304cc": dados_lead["9774abceca413e202f5ae99db37af307340304cc"],
      "f9e21bf8524892128a27d0c7886a85edba97105c": dados_lead["f9e21bf8524892128a27d0c7886a85edba97105c"],
      "8f63351fb6d95b21438dfaf19c09995acabc2f09": dados_lead["8f63351fb6d95b21438dfaf19c09995acabc2f09"],
      "9a5d202668a2e507335baa51573d5b4c4f97ea64": dados_lead["9a5d202668a2e507335baa51573d5b4c4f97ea64"],
      "385630236c989d17c56ec59732b78d23b1f9b56a": dados_lead["385630236c989d17c56ec59732b78d23b1f9b56a"],
      "69b8e808073d8d63787d90385449dc48b00bc10d": user_id,
      "label": "165",
      "visible_to": "1",
      "status": "open",
      "active": true,
      "stage_id": 104
    });
  } else {
    raw = JSON.stringify({
      "title": dados_lead["title"],
      "value": null,
      "expected_close_date": null,
      "user_id": user_id,
      "person_id": dados_lead["person_id"],
      "org_id": dados_lead["organization_id"],
      "next_activity_id": null,
      "5fca6336de210f847b78ce5fd7de950530e26e94": dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb": dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency": dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf": dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency": dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency"],
      "829d91cab91f6709555655e9e9a6289090407f0d": dados_lead["829d91cab91f6709555655e9e9a6289090407f0d"],
      "829d91cab91f6709555655e9e9a6289090407f0d_currency": dados_lead["829d91cab91f6709555655e9e9a6289090407f0d_currency"],
      "7f58a030551b0e72f14542f150980a167b77444a": dados_lead["7f58a030551b0e72f14542f150980a167b77444a"],
      "9774abceca413e202f5ae99db37af307340304cc": dados_lead["9774abceca413e202f5ae99db37af307340304cc"],
      "f9e21bf8524892128a27d0c7886a85edba97105c": dados_lead["f9e21bf8524892128a27d0c7886a85edba97105c"],
      "8f63351fb6d95b21438dfaf19c09995acabc2f09": dados_lead["8f63351fb6d95b21438dfaf19c09995acabc2f09"],
      "9a5d202668a2e507335baa51573d5b4c4f97ea64": dados_lead["9a5d202668a2e507335baa51573d5b4c4f97ea64"],
      "385630236c989d17c56ec59732b78d23b1f9b56a": dados_lead["385630236c989d17c56ec59732b78d23b1f9b56a"],
      "69b8e808073d8d63787d90385449dc48b00bc10d": user_id,
      "label": "165",
      "visible_to": "1",
      "status": "open",
      "active": true,
      "stage_id": 98
    });
  }
  
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  const response = await fetch("https://api.pipedrive.com/v1/deals?api_token=6c7d502747be67acc199b483803a28a0c9b95c09", requestOptions);
  return response.status;
}

async function buscar_e_arquivar_leads(org_name) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/search?term=${org_name}&exact_match=1&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  const result = await response.json();
  console.log(result);
  const bl = await envia_python(result);
  console.log(bl);
  for (let i = 0; i < result.data.items.length; i++) {
    const id = result.data.items[i].item.id;
    arquiva(id);
  }
  return response.status;
}

async function deletar_lead(id) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'DELETE', headers: myHeaders, redirect: 'follow' };
  
  const reponse = await fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  return reponse.status;
}

async function converter_lead_em_negocio() {
  const modal = document.querySelector('dialog');
  modal.innerHTML = '<img src="https://usagif.com/wp-content/uploads/loading-63.gif" alt="">';
  modal.style.backgroundColor = 'transparent';
  modal.style.border = 'none';
  modal.showModal();
  document.querySelector('.conteudo').style.opacity = '30%';
  
  const id_lead = document.querySelector("#nome_da_pessoa").idpipe;
  const titulo = document.querySelector("#empresa_da_pessoa").innerText;
  const user_id = document.querySelector("#Agente").value;
  const negocio_criado = await criarNegocio(id_lead, user_id);
  
  if (negocio_criado <= 299) {
    const deletar_o_lead = await deletar_lead(id_lead);
    if (deletar_o_lead <= 299) {
      const arquivar_leads = await buscar_e_arquivar_leads(titulo);
      if (arquivar_leads <= 299) {
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid black';
        modal.innerHTML = '<h1>Negócio Criado Com Sucesso</h1> <button>OK</button>';
        const buttonClose = modal.querySelector("button");
        buttonClose.onclick = function () {
          modal.close();
          modal.innerHTML = '';
          document.querySelector('.conteudo').style.opacity = '100%';
        };
      } else {
        alert("Erro ao arquivar os Leads");
      }
    } else {
      alert("Erro ao deletar o Lead");
    }
  } else {
    alert("Erro ao criar o negócio");
  }
}

async function buscar_o_lead(org_name, id_pessoa) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/search?term=${org_name}&person_id=${id_pessoa}&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  const result = await response.json();
  if (result.data.items.length === 0) {
    return 0;
  } else {
    const saida = result.data.items[0].item.id;
    return saida;
  }
}

async function pesquisaTelefone(telefone) {
  const apiToken = "6c7d502747be67acc199b483803a28a0c9b95c09";
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  try {
    const response = await fetch(`https://api.pipedrive.com/v1/persons/search?term=${telefone}&start=0&limit=1&api_token=${apiToken}`, requestOptions);
    const result = await response.json();
    if (result.data.items.length === 0) {
      const modal = document.querySelector('dialog');
      modal.innerHTML = '<h1>Nenhum Lead encontrado com o telefone informado</h1> <button>OK</button>';
      modal.showModal();
      const buttonClose = modal.querySelector("button");
      buttonClose.onclick = function () {
        modal.close();
        modal.innerHTML = '';
      };
    } else {
      const id_lead = await buscar_o_lead(result.data.items[0].item.organization.name, result.data.items[0].item.id);
      if (id_lead === 0) {
        const modal = document.querySelector('dialog');
        modal.innerHTML = '<h1>Nenhum Lead encontrado com o telefone informado</h1> <button>OK</button>';
        modal.showModal();
        const buttonClose = modal.querySelector("button");
        buttonClose.onclick = function () {
          modal.close();
          modal.innerHTML = '';
        };
      } else {
        const saida = {
          "org_name": result.data.items[0].item.organization.name,
          "nome_pessoa": result.data.items[0].item.name,
          "telefone": result.data.items[0].item.phones[0],
          "id_lead": id_lead
        };
        document.querySelector("#nome_da_pessoa").innerText = saida.nome_pessoa;
        document.querySelector("#nome_da_pessoa").idpipe = saida.id_lead;
        document.querySelector("#telefone_da_pessoa").innerText = saida.telefone;
        document.querySelector("#empresa_da_pessoa").innerText = saida.org_name;
        document.querySelector('#dados-deal').style.display = 'block';
        console.log(saida);
      }
    }
  } catch (error) {
    console.log('error', error); 
  }
}

async function numeros_para_bloqueio(data) {
  let lista_numeros = [];
  for (let index = 0; index < data.data.items.length; index++) {
    if (data.data.items[index].item.person) {
      const element = data.data.items[index].item.person.id;
      const telefone = await pesquisa_telefone(element);
      lista_numeros.push({"phone_number": formatarTelefone(telefone), "event": "bloqueado"});
    }
  }
  return lista_numeros;
}

async function pesquisa_telefone(id) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch(`https://api.pipedrive.com/v1/persons/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
  const saida = await response.json();
  return saida.data.phone[0].value;
}

async function envia_python(lista) {
  const exemplo = await numeros_para_bloqueio(lista);
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(exemplo)
  };
  
  fetch("https://calix-5d642828daaa.herokuapp.com/altera", requestOptions)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao enviar solicitação');
      return response.json();
    })
    .then(data => {
      console.log('Resposta do servidor:', data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function formatarTelefone(numero) {
  let numeroLimpo = numero.replace(/[^0-9]/g, '');
  if (numeroLimpo.length > 11 && numeroLimpo.startsWith('55')) {
    numeroLimpo = numeroLimpo.substring(2);
  }
  if (numeroLimpo.length === 10) {
    numeroLimpo = numeroLimpo.substring(0, 2) + '9' + numeroLimpo.substring(2);
  }
  if (numeroLimpo.length === 11) {
    return '(' + numeroLimpo.substring(0, 2) + ') ' + numeroLimpo.substring(2, 7) + '-' + numeroLimpo.substring(7);
  }
}

async function busca_usuarios() {
  const select = document.querySelector('#Agente');
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
  
  const response = await fetch("https://api.pipedrive.com/v1/users?api_token=6c7d502747be67acc199b483803a28a0c9b95c09", requestOptions);
  const result = await response.json();
  const data = result.data;
  let option = '<option value="">Selecione</option>\n ';
  for (const usuario of data) {
    if (usuario.active_flag) {
      option += `<option value="${usuario.id}">${usuario.name}</option>\n`;
    }
  }
  select.innerHTML = option;
}

async function busca_produto(tipo_produto=false){
  let myHeaders = new Headers();
  const selects = document.querySelectorAll('select.produto')
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=uZLXsan3EYIr0jXLITKQvw2diO7swzKAuu11ClJqL8Y-1707158030-1-ATQv7mQdA2TBU1bCrsLXh8Ggq/xnMpFiZ0nG3sCLUIe8wMEZvP/mUo25grW940UiyOM3V2gwLdB2QaFEKJ1wWag=");

  let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  let filtro_especifico;
  if(tipo_produto){
    filtro_especifico=2055
  } else {
    filtro_especifico=109
  }
  const response = await fetch(`https://api.pipedrive.com/v1/products?filter_id=${filtro_especifico}&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`);
  const result = await response.json();

  // result.data é um array de produtos
  const data = result.data || [];

  // Para cada select.produto
  selects.forEach(selectEl => {
    // Limpar opções existentes
    while (selectEl.firstChild) {
      selectEl.removeChild(selectEl.firstChild);
    }

    // Criar um DocumentFragment para montar as <option> em memória
    const fragment = document.createDocumentFragment();

    // Opção padrão "Selecione"
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione';
    fragment.appendChild(defaultOption);

    // Criar <option> para cada produto ativo
    data.forEach(produto => {
      if (produto.active_flag) {
        const opt = document.createElement('option');
        opt.value = produto.id;
        opt.textContent = produto.name;
        fragment.appendChild(opt);
      }
    });

    // Inserir tudo de uma vez no <select>
    selectEl.appendChild(fragment);
  });
  
}

const mapa_par_pj = {
  "MESANODOREQUERIMENTODOPARCELAMENTO":"DATA_REQUERIMENTO",
  "NUMERODACONTADOPARCELAMENTO":"NUMERO_CONTA",
  "TIPODEPARCELAMENTO":"TIPO_PARCELAMENTO",
  "MODALIDADEDOPARCELAMENTO":"MODALIDADE",
  "SITUACAODOPARCELAMENTO":"SITUACAO",
  "QTDEDEPARCELASCONCEDIDAS":"QNT_PARCELAS",
  "PARCELASATRASADAS":"QNT_PARCELAS_ATRASADAS",
  "VALORCONSOLIDADO":"VALOR_CONSOLIDADO",
  "VALORDOPRINCIPAL":"VALOR_PINCIPAL"
};
