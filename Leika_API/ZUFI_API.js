const zufi_api = "https://zufi.api.vsm.nrw/zustaendigkeiten";
const leika_api = "https://leika.vsm.nrw/services/";
const leika_apiKeyword = "https://leika.vsm.nrw/services/";
const REGIONAL_SCHLUESSEL = "051170000000";
const SPRACHE = "DE";
//Fetch Zufi API Data

async function fetchDataZufi(optionalKeyID) {
  const leistungsschluesselElement = document.getElementById(
    "leistungsschluessel"
  );
  let leistungsschluessel = leistungsschluesselElement.value;

  if (optionalKeyID !== undefined) {
    leistungsschluessel = optionalKeyID;
  }

  const params = {
    regionalSchluessel: REGIONAL_SCHLUESSEL,
    leistungsSchluessel: leistungsschluessel,
    sprache: SPRACHE,
  };

  try {
    const response = await fetch(`${zufi_api}?${new URLSearchParams(params)}`);
    const zufiData = await response.json();
    const mytable = document.getElementById("myTable");

    if (leistungsschluessel !== "") {
      document.getElementById("1").innerText = "Stammtext";
      document.getElementById("2").innerText = "Inhalt";
    }
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
  const params = { leistungsSchluessel: leistungsschluessel };
  const isKeyword = /[a-zA-Z]|§/.test(leistungsschluessel); // Testing if Keyword is a word

  try {
    const response = await fetch(
      isKeyword
        ? `${leika_apiKeyword}?q=${new URLSearchParams(params)}`
        : `${leika_api}${new URLSearchParams(params)}`
    );
    const leikaData = await response.json();
    const mytable = document.getElementById("myTable");

    if (isKeyword) {
      getLeikaKeyword(leikaData, mytable);
    } else {
      if (leistungsschluessel !== "") {
        document.getElementById("1").innerText = "Stammtext";
        document.getElementById("2").innerText = "Inhalt";
      }
      getLeika(leikaData, mytable);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

//Leika API processing function
function getLeika(leikaData, mytable) {
  document.getElementById("status").innerText = "LeiKa-API";
  const table = mytable;
  table.style.borderCollapse = "collapse";

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
  document.getElementById("status").innerText = "LeiKa-API";
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
    row.style.cursor = "pointer";
  }
}

//Zufi API processing function
function getZufi(zufiData, mytable) {
  //Set API Indicator Text
  document.getElementById("status").innerText = "ZuFi-API";
  const table = mytable;
  table.style.borderCollapse = "collapse";

  //Calling the thead/tbody from the table
  const thead = document.querySelector("thead");
  const tbody = document.querySelector("tbody");
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
}

//Create Row/Cells Function fpr the LeiKa-Keyword-Search
function createAndAppendCell(row, value) {
  const cell = document.createElement("td");
  cell.innerHTML = value;
  cell.style.border = "1px solid #ddd";
  row.appendChild(cell);
}
function clearResponse() {
  location.reload(true);
}
function downloadTableAsPDF() {
  // Open a new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.open();

  // Create a printable version of the table
  const tableHtml = document.getElementById("myTable").outerHTML;
  const printableContent = `${tableHtml}`;

  // Write the printable content to the new window
  printWindow.document.write(printableContent);
  printWindow.document.close();

  // Check if the user is using Chrome
  const isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  if (isChrome) {
    // If the user is using Chrome, use a timeout
    setTimeout(function () {
      printWindow.print();
      printWindow.close();
    }, 1000);
  } else {
    // If the user is not using Chrome, print immediately
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  }
}

// Generic function from W3 CSS
function tableToCSV() {
  // Variable to store the final csv data
  let csv_data = [];

  // Get each row data
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    // Get each column data
    let cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    let csvrow = [];
    for (let j = 0; j < cols.length; j++) {
      // Get the text data of each cell
      // of a row and push it to csvrow
      csvrow.push(cols[j].innerHTML);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  // Call this function to download csv file
  downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) {
  // Create CSV file object and feed
  // our csv_data into it
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  // Create to temporary link to initiate
  // download process
  let temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "GfG.csv";
  let url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
