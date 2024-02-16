// API-Endpunkt
const apiUrl = "https://leika.vsm.nrw/services/";
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
    const response = await fetch(`${apiUrl}${new URLSearchParams(params)}`);
    const data = await response.json();

    const result = convert(data);
    createtable(result);
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
// Diese Funktion erstellt eine Tabelle, indem zuvor das Array von HTMLTags bereinigt wird.
function createtable(result) {
  // Entferne HTML-Tags aus dem result-Array (stripHtmlFrom2DArray ist eine separate Funktion).
  const strippedArray = stripHtmlFrom2DArray(result);
  // Wähle das <tbody>-Element der Tabelle mit der ID "myTable" aus.
  const tableBody = document.querySelector("#myTable tbody");
  tableBody.innerHTML = "";
  // Iteriere über jede Zeile (rowData) im result-Array.
  result.forEach((rowData) => {
    // Erstelle eine neue <tr>-Zeile für die Tabelle.
    const row = document.createElement("tr");

    // Iteriere über jede Zelle (cellData) in der aktuellen Zeile.
    rowData.forEach((cellData) => {
      // Erstelle eine neue <td>-Zelle für die Tabelle.
      const cell = document.createElement("td");

      // Setze den Textinhalt der Zelle auf den Wert der aktuellen Zelle (cellData).
      cell.textContent = cellData;

      // Füge die Zelle zur aktuellen Zeile hinzu.
      row.appendChild(cell);
    });

    // Füge die fertige Zeile zur Tabelle hinzu.
    tableBody.appendChild(row);
  });
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
