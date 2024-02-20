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
    // removeTable(mytable);
    getKey(data, mytable);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

function getKey(data, mytable) {
  const table = mytable;
  table.style.borderCollapse = "collapse"; // Add this line for table border collapse

  const thead = document.querySelector("thead"); // Assuming the table already has a <thead> element
  const tbody = document.querySelector("tbody"); // Assuming the table already has a <tbody> element
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  for (const key in data.leistungStammtext) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = key;
    keyCell.style.border = "1px solid #ddd"; // Add this line for cell borders
    const valueCell = document.createElement("td");
    const value = data.leistungStammtext[key];

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
          valueCell.textContent += subValue + ", ";
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
