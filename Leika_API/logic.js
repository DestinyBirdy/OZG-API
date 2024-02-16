// API-Endpunkt
const apiUrl = "https://leika.vsm.nrw/services/";
const apiUrlsearch = "https://leika.vsm.nrw/services";
// Eine GET-Anfrage an die API senden
async function fetchData() {
  const leistungsschluessel = document.getElementById(
    "leistungsschluessel"
  ).value;
  const params = {
    //regionalSchluessel: "057620012012",
    leistungsSchluessel: leistungsschluessel,
    //sprache: "DE",
  };

  try {
    let response;

    if (/[a-zA-Z]|§/.test(leistungsschluessel) === true) {
      response = await fetch(
        `${apiUrlsearch}?q=${new URLSearchParams(params)}`
      );
      const data = await response.json();
      buildTable2(data);
    } else {
      response = await fetch(`${apiUrl}${new URLSearchParams(params)}`);
      const data = await response.json();
      const result = convert(data);
      buildTable2(result);
      const tableHeaders = document.getElementsByTagName("th");
      tableHeaders[0].innerHTML = "Stammtext";
      tableHeaders[1].innerHTML = "Inhalt";
      //createtable(result);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

// Antwort im HTML-Dokument anzeigen
function displayResponse(data) {
  const formattedResponse = JSON.stringify(data, null, 2);
  document.getElementById("api-response").innerText = formattedResponse;
}
// Diese Funktion konvertiert ein Objekt (data) in eine HTML-Tabelle.
function convert(data) {
  var result = []; // Ein leeres Array, in das wir die Daten umwandeln werden.

  // Iteriere über die Eigenschaften des Objekts und füge sie als Arrays in das result-Array ein.
  for (var i in data) {
    result.push([i, data[i]]);
  }
  return result;
}

// Antwort löschen
function clearResponse() {
  //document.getElementById('api-response').innerText = '';
  location.reload();
}

function stripHtmlFrom2DArray(array) {
  // Iteriere über jedes Element im äußeren Array
  if (array.length === 0) {
    const myHeading = document.getElementById("Error");
    myHeading.textContent = "Fehlerhafte LEIKA";
  } else {
    const myHeading = document.getElementById("Error");
    myHeading.textContent = "";
    for (let i = 0; i < array.length; i++) {
      // Überprüfe, ob das Element ein Array ist
      if (Array.isArray(array[i])) {
        // Iteriere über jedes Element im inneren Array
        for (let j = 0; j < array[i].length; j++) {
          // Überprüfe, ob das innere Element ein String ist
          if (typeof array[i][j] === "string") {
            // Entferne HTML-Tags aus dem String
            array[i][j] = array[i][j].replace(/<[^>]*>|&#xa0;/g, "");
          }
        }
      }
    }
    return array;
  }
}

function buildTable2(data) {
  const myArray = data;
  // Create the table header row
  const table = document.getElementById("myTable");
  // Clear existing table content
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  const headerRow = document.createElement("tr");
  for (const key in myArray[0]) {
    if (myArray[0].hasOwnProperty(key)) {
      const headerCell = document.createElement("th");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    }
  }
  table.appendChild(headerRow);

  // Create rows for each object

  myArray.forEach((obj) => {
    const row = document.createElement("tr");
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const cell = document.createElement("td");
        const cleanedContent = obj[key]
          .toString()
          .replace(/<[^>]*>|&#xa0;/g, "");

        cell.textContent = cleanedContent;
        cell.addEventListener("click", () => {
          cell.classList.toggle("expanded"); // Toggle expanded state
        });
        row.appendChild(cell);
      }
    }
    table.appendChild(row);
  });
}

// Funktion zum Exportieren einer HTML-Tabelle als PDF
function exportToPdf() {
  // Schritt 1: HTML-Tabelle aus dem DOM abrufen
  var tableHtml = document.getElementById("myTable").outerHTML; // Änderung hier

  // Schritt 2: Stil für die PDF-Darstellung definieren
  var style = `
      <style>
          table {
              width: 100%;
              font: 12px Calibri;
          }
          table, th, td {
              border: solid 1px #DDD;
              border-collapse: collapse;
              padding: 2px 3px;
              text-align: justify;
          }
      </style>
  `;

  // Schritt 3: Ein neues Fenster öffnen, um die PDF darzustellen
  var printWindow = window.open("", "_blank", "height=700,width=700");
  printWindow.document.write("<html><head>");
  printWindow.document.write(style);
  printWindow.document.write("</head><body>");

  // Schritt 4: Die HTML-Tabelle in das Fenster schreiben
  printWindow.document.write(tableHtml);
  printWindow.document.write("</body></html>");

  // Schritt 5: Nach einer kurzen Verzögerung die PDF drucken und das Fenster schließen
  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 100);
}
