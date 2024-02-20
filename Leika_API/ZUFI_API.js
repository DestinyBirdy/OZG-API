const zufi_api = "https://zufi.api.vsm.nrw/zustaendigkeiten";

async function fetchData() {
  const leistungsschluessel = document.getElementById(
    "leistungsschluessel"
  ).value;
  const params = {
    regionalSchluessel: "051170000000",
    leistungsSchluessel: leistungsschluessel,
    sprache: "DE",
  };

  try {
    const response = await fetch(`${zufi_api}?${new URLSearchParams(params)}`);
    const data = await response.json();
    const mytable = document.createElement("table");
    //removeTable(mytable);
    getKey(data, mytable);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

function getKey(data, mytable) {
  const table = mytable;
  table.style.borderCollapse = "collapse"; // Add this line for table border collapse

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  const keyHeader = document.createElement("th");

  keyHeader.textContent = "Stammtext";
  keyHeader.style.border = "1px solid #ddd"; // Add this line for cell borders
  const valueHeader = document.createElement("th");
  valueHeader.textContent = "Inhalt";
  valueHeader.style.border = "1px solid #ddd"; // Add this line for cell borders
  headerRow.appendChild(keyHeader);
  headerRow.appendChild(valueHeader);
  thead.appendChild(headerRow);

  for (const key in data.leistungStammtext) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = key;
    keyCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    const valueCell = document.createElement("td");
    const value = data.leistungStammtext[key];

    if (Array.isArray(value)) {
      for (const key in value) {
        const stringValue = String(value[key].uri);
        if (stringValue.startsWith("http")) {
          const a = document.createElement("a");
          a.title = value[key].titel;
          a.href = value[key].uri;
          a.textContent = value[key].titel;
          valueCell.appendChild(a);
          const br = document.createElement("br");
          valueCell.appendChild(br);
        } else {
          valueCell.innerHTML = data.leistungStammtext[key];
        }
      }
    } else {
      valueCell.innerHTML = data.leistungStammtext[key];
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

//   data.forEach((obj) => {
//     console.log(obj);
//   });
// }if (key === "")
// if (typeof data.leistungStammtext[key] === "object") {
//     for (const inKey in data.leistungStammtext) console.log(inKey);
//   } else {JSON.stringify(
// console.log(value[key]);

// valueCell.innerHTML += a + "<br>";
// console.log(valueCell);
// function removeTable(mytable) {
//   if (mytable) {
//     console.log(typeof tableToRemove);
//     mytable.removeChild(mytable.firstChild);
//   }
// }
function clearResponse() {
  //document.getElementById('api-response').innerText = '';
  location.reload();
}
