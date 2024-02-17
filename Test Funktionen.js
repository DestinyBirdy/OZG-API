function buildTable2(data) {
  const myArray = data;
  const table = document.getElementById("myTable");

  // Clear existing table content
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  // Create the table header row
  const headerRow = document.createElement("tr");
  const contentHeaderCell = document.createElement("th");
  contentHeaderCell.textContent = "Inhalt";
  headerRow.appendChild(contentHeaderCell);
  table.appendChild(headerRow);

  // Create rows for each object
  myArray.forEach((obj) => {
    const row = document.createElement("tr");
    const contentCell = document.createElement("td");
    const textCell = document.createElement("td");

    // Move existing header values to the "Inhalt" column
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key !== "Test") {
          textCell.innerHTML += `<strong>${key}:</strong> ${obj[key]}<br>`;
        } else {
          contentCell.innerHTML = obj[key];
        }
      }
    }

    // Add event listener to toggle expanded state
    contentCell.addEventListener("click", () => {
      contentCell.classList.toggle("expanded");
    });

    row.appendChild(contentCell);
    row.appendChild(textCell);
    table.appendChild(row);
  });
}
