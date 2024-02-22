const zufi_api = "https://zufi.api.vsm.nrw/zustaendigkeiten";
const leika_api = "https://leika.vsm.nrw/services/";
const leika_apiKeyword = "https://leika.vsm.nrw/services/";
//Fetch Zufi API Data

async function fetchDataZufi(optionalKeyID) {
  let leistungsschluessel;
  leistungsschluessel = document.getElementById("leistungsschluessel").value;
  console.log(optionalKeyID);
  if (optionalKeyID !== undefined) {
    leistungsschluessel = optionalKeyID;
    console.log(leistungsschluessel);
  }
  console.log(leistungsschluessel);
  const params = {
    regionalSchluessel: "051170000000",
    leistungsSchluessel: leistungsschluessel,
    sprache: "DE",
  };

  try {
    const response = await fetch(`${zufi_api}?${new URLSearchParams(params)}`);
    const zufiData = await response.json();
    const mytable = document.createElement("table");
    document.getElementById("1").innerText = "Stammtext";
    document.getElementById("2").innerText = "Inhalt";
    getZufi(zufiData, mytable);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}
//Fetch Leika API Data
async function fetchDataLeika() {
  const leistungsschluessel = document.getElementById(
    "leistungsschluessel"
  ).value;
  const params = {
    leistungsSchluessel: leistungsschluessel,
  };

  try {
    const response = await fetch(
      /[a-zA-Z]|§/.test(leistungsschluessel)
        ? `${leika_apiKeyword}?q=${new URLSearchParams(params)}`
        : `${leika_api}${new URLSearchParams(params)}`
    );
    const leikaData = await response.json();
    const mytable = document.createElement("table");
    if (/[a-zA-Z]|§/.test(leistungsschluessel) === true) {
      getLeikaKeyword(leikaData, mytable);
    } else {
      document.getElementById("1").innerText = "Stammtext";
      document.getElementById("2").innerText = "Inhalt";
      getLeika(leikaData, mytable);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

//Leika API processing function
function getLeika(leikaData, mytable) {
  document.getElementById("status").innerText = "LeiKa Abfrage";
  const table = mytable;
  table.style.borderCollapse = "collapse";

  const thead = document.querySelector("thead"); // Assuming the table already has a <thead> element
  const tbody = document.querySelector("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  for (const key in leikaData) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = key;
    keyCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    const valueCell = document.createElement("td");
    const value = leikaData[key];

    valueCell.innerHTML = value;

    valueCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }
}
// Leika API-Keyword processing function
function getLeikaKeyword(leikaData, mytable) {
  const leikaDataKeyword = leikaData;
  document.getElementById("status").innerText = "LeiKa Abfrage";
  const table = mytable;
  table.style.borderCollapse = "collapse";

  const thead = document.querySelector("thead"); // Assuming the table already has a <thead> element
  const tbody = document.querySelector("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Function to handle row click
  function handleRowClick(event) {
    const row = event.currentTarget;
    const keyCell = row.querySelector("td"); // Assuming you want the first cell
    const schluessel = keyCell.textContent;
    fetchDataZufi(schluessel);
  }

  for (const key in leikaDataKeyword) {
    const counter = key;
    const row = document.createElement("tr");
    createAndAppendCell(row, leikaDataKeyword[counter].Schluessel);
    createAndAppendCell(row, leikaDataKeyword[counter].Bezeichnung);
    createAndAppendCell(row, leikaDataKeyword[counter].Volltext);

    // Attach the click event listener to the row
    row.addEventListener("click", handleRowClick);

    tbody.appendChild(row);
  }
}

//Zufi API processing function
function getZufi(zufiData, mytable) {
  document.getElementById("status").innerText = "xZuFi Abfrage";
  const table = mytable;
  table.style.borderCollapse = "collapse"; // Add this line for table border collapse

  const thead = document.querySelector("thead"); // Assuming the table already has a <thead> element
  const tbody = document.querySelector("tbody"); // Assuming the table already has a <tbody> element
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  for (const key in zufiData.leistungStammtext) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = key;
    keyCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    const valueCell = document.createElement("td");
    const value = zufiData.leistungStammtext[key];

    if (Array.isArray(value)) {
      for (const subValue of value) {
        const stringValue = String(subValue.uri);
        if (stringValue.startsWith("http")) {
          const a = document.createElement("a");
          a.title = subValue.titel;
          a.href = subValue.uri;
          a.textContent = subValue.titel;
          valueCell.appendChild(a);
          const br = document.createElement("br");
          valueCell.appendChild(br);
        } else {
          if (subValue.endsWith(" ")) {
            valueCell.textContent += subValue.trim() + ", ";
          } else {
            valueCell.textContent += subValue + ", ";
          }
        }
      }
    } else {
      valueCell.innerHTML = value;
    }

    valueCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    row.appendChild(keyCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  document.body.appendChild(table);
}

//Create Row/Cells Function
function createAndAppendCell(row, value) {
  const cell = document.createElement("td");
  cell.innerHTML = value;
  cell.style.border = "1px solid #ddd";
  row.appendChild(cell);
}
