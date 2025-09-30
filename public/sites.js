const form = document.getElementById("siteForm");
const siteIdInput = document.getElementById("siteId");
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const imageInput = document.getElementById("image");
const scoreInput = document.getElementById("score");
const table = document.getElementById("sitesTable");

const API_URL = "/sites";

async function fetchSites() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) alert("Network response was not ok");
    return await response.json();
  } catch (error) {
    alert("Error fetching sites:", error);
    return [];
  }
}

async function loadSites() {
  const sites = await fetchSites();
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  if (sites.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="5" style="padding: 40px; color: #6c757d;">No sites to display</td>';
    tbody.appendChild(row);
    return;
  }

  sites.forEach((site) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-weight: 600;">${site.name}</td>
      <td>
        <img src="${site.image}" class="site-image" alt="${site.name}"
      </td>
      <td><a href="${site.url}" target="_blank" class="site-url">${
      site.url
    }</a></td>
      <td><span class="score-badge">${site.score}</span></td>
      <td>
        <div class="action-buttons">
          <button class="edit-btn" onclick="editSite('${
            site._id
          }', '${site.name.replace(/'/g, "\\'")}', '${site.url}', '${
      site.image
    }', ${site.score})">edit</button>
          <button class="delete-btn" onclick="deleteSite('${
            site._id
          }')">delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const site = {
    name: nameInput.value.trim(),
    url: urlInput.value.trim(),
    image: imageInput.value.trim(),
    score: parseInt(scoreInput.value),
  };

  try {
    let res;
    if (siteIdInput.value) {
      res = await fetch(`${API_URL}/${siteIdInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      if (res.ok) {
        alert("The site has been updated");
      } else {
        const data = await res.json();
        alert(data[0].message || "Update failed");
        return;
      }
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      if (res.ok) {
        alert("The site has been added");
      } else {
        const data = await res.json();
        alert(data[0].message || "Add failed");
        return;
      }
    }
    form.reset();
    siteIdInput.value = "";
    loadSites();
  } catch (error) {
    console.error("Error saving site:", error);
    alert("Error saving site");
  }
});

function editSite(id, name, url, image, score) {
  siteIdInput.value = id;
  nameInput.value = name;
  urlInput.value = url;
  imageInput.value = image;
  scoreInput.value = score;

  document
    .querySelector(".form-section")
  nameInput.focus();
}

async function deleteSite(id) {
  if (!confirm("Are you sure you want to delete this site?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("The site has been deleted");
    loadSites();
  } catch (error) {
    console.error("Error deleting site:", error);
    alert("Error deleting site");
  }
}

loadSites();
