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
      console.log(data);
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
      // Create a new div element for the header cell
      const headerCell = document.createElement("div");
      headerCell.classList.add("header-cell"); // Add a CSS class to the header cell

      // Use a switch statement to set the text content of the header cell
      switch (key) {
        case Object.keys(myArray[0])[0]:
          // If checkLeika is true, display "Stammtext"; otherwise, display the key
          headerCell.textContent = checkLeika ? "Stammtext" : key;
          break;
        case Object.keys(myArray[0])[1]:
          // If checkLeika is true, display "Inhalt"; otherwise, display the key
          headerCell.textContent = checkLeika ? "Inhalt" : key;
          break;
        default:
          // For other keys, simply display the key itself
          headerCell.textContent = key;
      }

      // Append the header cell to the header row
      headerRow.appendChild(headerCell);
    }
  }
  container.appendChild(headerRow);
  console.log("Test");
  // Erstelle für jedes Objekt eine Zeile
  myArray.forEach((obj) => {
    const row = document.createElement("div");
    row.classList.add("data-row"); // Add a CSS class

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const cell = document.createElement("div");
        cell.classList.add("data-cell"); // Add a CSS class
        cell.style.position = "relative"; // Set position to relative

        // Limit the cell content to a maximum of 10 characters
        if (checkLeika) {
          cell.innerHTML = obj[key];
        } else {
          cell.style.whiteSpace = "nowrap";
          const truncatedValue = obj[key]
            .toString()
            .replace(
              /<figure class="table">|<\/figure>|<table>|\r|\n|\t|&nbsp;|<p>|<\/p>|<\/table>|<tbody>|<\/tbody>|<tr>|<\/tr>|<td>|<\/td>/g,
              ""
            )
            .substring(0, 50);
          cell.innerHTML = truncatedValue; // Use innerHTML to render list tags

          // Add an expandable indicator (e.g., a small arrow) only if the cell content is truncated
          if (obj[key].length > 50) {
            const indicator = document.createElement("span");
            indicator.classList.add("expand-indicator"); // Add a CSS class for styling
            indicator.innerHTML = "▶"; // Unicode arrow right symbol
            // Position the indicator at the bottom right corner within the cell
            indicator.style.position = "absolute";
            indicator.style.bottom = "0";
            indicator.style.right = "0";
            indicator.style.fontSize = "12px";

            // Append the indicator to the cell
            cell.appendChild(indicator);
            // Toggle expanded state on click
            cell.addEventListener("click", () => {
              if (cell.classList.contains("expanded")) {
                cell.innerHTML = truncatedValue;
                cell.classList.remove("expanded");
                indicator.innerHTML = "▶";
                cell.appendChild(indicator);
              } else {
                cell.innerHTML = obj[key]
                  .toString()
                  .replace(
                    /<figure class="table">|<\/figure>|<table>|\r|\n|\t|&nbsp;|<\/table>|<tbody>|<\/tbody>|<tr>|<\/tr>|<td>|<\/td>/g,
                    ""
                  );
                cell.classList.add("expanded");
                indicator.innerHTML = "▼";
                cell.appendChild(indicator); // Change arrow to downward when expanded
              }
            });
          }
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
  var tableHtml = document.getElementById("myContainer").innerHTML;

  // Schritt 2: Stil für die PDF-Darstellung definieren
  var style = `
      <style>
          div {
              width: 100%;
              font: 12px Calibri;
              border: solid 1px #DDD;
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
