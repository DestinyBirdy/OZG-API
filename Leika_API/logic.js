// API-Endpunkt
const apiUrl = "https://leika.vsm.nrw/services/";
const apiUrlsearch = "https://leika.vsm.nrw/services";
// Eine GET-Anfrage an die API senden
async function fetchData() {
  const leistungsschluessel = document.getElementById(
    "leistungsschluessel"
  ).value;
  const params = {
    leistungsSchluessel: leistungsschluessel,
  };

  try {
    const response = await fetch(
      /[a-zA-Z]|§/.test(leistungsschluessel)
        ? `${apiUrlsearch}?q=${new URLSearchParams(params)}`
        : `${apiUrl}${new URLSearchParams(params)}`
    );
    const data = await response.json();
    if (/[a-zA-Z]|§/.test(leistungsschluessel) === true) {
      buildTable2(data, false);
    } else {
      const result = convert(data);
      buildTable2(result, true);
      const tableHeaders = document.getElementsByTagName("th");
      //tableHeaders[0].innerHTML = "Stammtext";
      //tableHeaders[1].innerHTML = "Inhalt";
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
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

function buildTable2(data, check) {
  const checkLeika = check;
  const myArray = data;
  const container = document.getElementById("myContainer"); // Verwende ein Container-Element statt einer Tabelle
  // Lösche den vorhandenen Inhalt im Container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Erstelle die Überschriftenzeile
  const headerRow = document.createElement("div");
  headerRow.classList.add("header-row"); // Füge eine CSS-Klasse hinzu, um das Styling zu steuern
  for (const key in myArray[0]) {
    if (myArray[0].hasOwnProperty(key)) {
      const headerCell = document.createElement("div");
      headerCell.classList.add("header-cell"); // Füge eine CSS-Klasse hinzu
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    }
  }
  container.appendChild(headerRow);

  // Erstelle für jedes Objekt eine Zeile
  myArray.forEach((obj) => {
    const row = document.createElement("div");
    row.classList.add("data-row"); // Füge eine CSS-Klasse hinzu

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const cell = document.createElement("div");
        cell.classList.add("data-cell"); // Füge eine CSS-Klasse hinzu
        cell.style.whiteSpace = "nowrap";
        // Begrenze den Zelleninhalt auf maximal 10 Zeichen
        if (checkLeika) {
          cell.innerHTML = obj[key];
        } else {
          const truncatedValue = obj[key].toString().substring(0, 50);
          cell.innerHTML = truncatedValue; // Verwende innerHTML, um Listen-Tags zu rendern
          // Füge einen Klick-Eventlistener hinzu, um den erweiterten Zustand zu toggeln
          cell.addEventListener("click", () => {
            if (cell.classList.contains("expanded")) {
              cell.innerHTML = truncatedValue;
              cell.classList.remove("expanded"); // Entferne die "expanded"-Klasse
            } else {
              cell.innerHTML = obj[key];
              cell.classList.add("expanded"); // Füge die "expanded"-Klasse hinzu
            }
          });
        }
        row.appendChild(cell);
      }
    }
    container.appendChild(row);
  });
}

// Funktion zum Exportieren einer HTML-Tabelle als PDF
function exportToPdf() {
  // Schritt 1: HTML-Tabelle aus dem DOM abrufen
  var tableHtml = document.getElementById("myContainer").outerHTML; // Änderung hier

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
