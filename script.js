function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.add("hidden"));

  const targetPage = document.getElementById(pageId);
  targetPage.classList.remove("hidden");

  if (pageId === "dashboard") {
    history.pushState(null, "", `?page=${pageId}`);
    fetchCategories();
    toggleDropdown();
  } else if (pageId === "perfil") {
    history.pushState(null, "", `?page=${pageId}`);
    loadUserProfile();
  }
}

function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.classList.toggle("hidden");
}

function showSubPage(pageId) {
  showPage(pageId);

  const dropdownMenu = document.getElementById("dropdown-menu");
  if (dropdownMenu.classList.contains("hidden")) {
    dropdownMenu.classList.remove("hidden");
  }

  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => item.classList.remove("active"));

  const activeItem = document.querySelector(`.dropdown-item[id="${pageId}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  const section = document.getElementById("pageTable");
  section.classList.remove("hidden");
  section.classList.add("visible");

  const headerTitle = section.querySelector("h2");
  headerTitle.textContent = `Estoque / ${pageId}`;

  fetchCategoryData(pageId);
}

async function fetchCategoryData(pageId) {
  try {
    const response = await fetch(`http://localhost:3000/categories/${pageId}`);
    const data = await response.json();
    renderCategoryData(data);
  } catch (error) {
    console.error("Erro ao buscar dados da categoria:", error);
  }
}

function getPageIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}

const iconMap = {
  Componentes: "📦",
  Computadores: "💻",
  Celulares: "📱",
  Materiais: "🔧",
  Cabos: "🔌",
  Monitores: "🖥️",
  Impressoras: "🖨️",
  Teclados: "⌨️",
  Mouses: "🖱️",
  Fones: "🎧",
  Roteadores: "📶",
  Software: "💿",
  Livros: "📚",
  Escritório: "🏢",
  Jogos: "🎮",
  Eletrônicos: "🔋",
  Tablets: "📲",
  Câmeras: "📷",
  Smartwatches: "⌚",
  Acessórios: "📎",
  Armazenamento: "💾",
};

function renderCategories(categories) {
  const container = document.querySelector(".cards");
  container.innerHTML = "";

  categories.forEach((category) => {
    const icon = iconMap[category.categoria] || "❓";
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
      <div class="icon">${icon}</div>
      <p>${category.categoria}</p>
      <span class="count">${category.quantidade}</span>
    `;

    card.onclick = () => {
      const pageId = category.categoria;
      history.pushState(null, "", `?page=${pageId}`);
      showSubPage(pageId);
    };

    container.appendChild(card);
  });
}

function renderCategoryMenu(categories) {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.innerHTML = "";

  categories.forEach((category) => {
    const menuItem = document.createElement("a");
    menuItem.href = "#";
    menuItem.id = category.categoria;
    menuItem.classList.add("dropdown-item");

    menuItem.onclick = (event) => {
      event.preventDefault();
      history.pushState(null, "", `?page=${category.categoria}`);
      showSubPage(category.categoria);
    };

    menuItem.innerHTML = `<span class="dot"></span>${category.categoria}`;
    dropdownMenu.appendChild(menuItem);
  });
}

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    const categories = await response.json();
    renderCategories(categories);
    renderCategoryMenu(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
}

function renderCategoryData(items) {
  const tableHead = document.querySelector(".components-table thead");
  const tableBody = document.querySelector(".components-table tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
      <th>Codigo</th>
      <th>Nome</th>
      <th>Preco</th>
      <th>Quantidade</th>
      <th>Data de Entrada</th>
      <th>Data de Saida</th>
      <th>Tipo de Movimentacao</th>
      <th>Usuario</th>
      <th>Editar</th>
      <th>Deletar</th>
  `;
  tableHead.appendChild(headerRow);

  if (items && items.length > 0) {
    items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.codigo}</td>
        <td>${item.nome}</td>
        <td>R$ ${item.preco}</td>
        <td>${item.estoque} (Un.)</td>
        <td>${formatDate(item.dataEntrada)}</td>
        <td>${formatDate(item.dataSaida)}</td>
        <td>${item.tipoMovimentacao || "-"}</td>
        <td>${item.usuario || "-"}</td>
        <td><button class="edit-btn" onclick="openEditModalInContainer(${
          item.codigo
        })">✏️</button></td>
        <td><button class="delete-btn" onclick="openDeleteModalInContainer(${
          item.codigo
        })">🗑️</button></td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = `<td colspan="10" style="text-align: center;">Nenhum item disponível nesta categoria.</td>`;
    tableBody.appendChild(noDataRow);
  }
}

function openCreateModalInContainer() {
  const modalContainer = document.getElementById("modalContainer");
  const categoryName = getPageIdFromUrl();
  if (modalContainer) {
    modalContainer.innerHTML = `
      <div id="createModal" class="modal" style="display: flex;">
        <div class="modal-content">
          <span class="close" onclick="closeModalInContainer()">&times;</span>
          <h2>Adicionar Produto</h2>
          <form id="createProductForm">
            <label for="createNome">Nome:</label>
            <input type="text" id="createNome" name="nome" required />

            <label for="createCategoria">Categoria:</label>
            <input type="text" id="createCategoria" name="categoria" value="${categoryName}" readonly required disabled/>

            <label for="createPreco">Preço (unidade):</label>
            <input type="number" id="createPreco" name="preco" step="0.01" required />

            <label for="createQuantidade">Quantidade:</label>
            <input type="number" id="createQuantidade" name="quantidade" required />

            <label for="createTipoMovimentacao">Tipo de Movimentação:</label>
            <input type="text" id="createTipoMovimentacao" name="tipoMovimentacao" value="Entrada" readonly required disabled />

            <div class="modal-buttons">
              <button type="button" onclick="closeModalInContainer()">Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document
      .getElementById("createProductForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const productData = {
          nome: document.getElementById("createNome").value,
          preco: parseFloat(document.getElementById("createPreco").value),
          quantidade: parseInt(
            document.getElementById("createQuantidade").value
          ),
          tipoMovimentacao: "Entrada",
          categoria: document.getElementById("createCategoria").value,
          usuarioId: JSON.parse(sessionStorage.getItem("user")).Id_usuario,
          dataEntrada: new Date().toISOString().split("T")[0],
        };

        try {
          const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });

          const result = await response.json();

          result.success
            ? closeModalInContainer() && showToast(result.message)
            : showToast(result.message);
          fetchCategoryData(categoryName);
        } catch (error) {
          console.error("Erro:", error);
          showToast("Ocorreu um erro ao adicionar o produto.");
        }
      });
  }
}

async function openEditModalInContainer(productId) {
  const modalContainer = document.getElementById("modalContainer");

  try {
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    const product = await response.json();
    const categoryName = getPageIdFromUrl();

    if (modalContainer && product) {
      modalContainer.innerHTML = `
        <div id="editModal" class="modal" style="display: flex;">
          <div class="modal-content">
            <span class="close" onclick="closeModalInContainer()">&times;</span>
            <h2>Editar Produto</h2>
            <form id="editProductForm">
              <label for="editNome">Nome:</label>
              <input type="text" id="editNome" name="nome" value="${
                product.Nome
              }" required />
              
              <label for="editCategoria">Categoria:</label>
              <input type="text" id="editCategoria" name="categoria" value="${categoryName}" readonly required disabled />
              
              <label for="editPreco">Preço (unidade):</label>
              <input type="number" id="editPreco" name="preco" step="0.01" value="${
                product.Preco
              }" required />
              
              <label for="editQuantidade">Quantidade:</label>
              <input type="number" id="editQuantidade" name="quantidade" value="${
                product.Quantidade
              }" required />
              
              <label for="editTipoMovimentacao">Tipo de Movimentação:</label>
              <select id="editTipoMovimentacao" name="tipoMovimentacao" required>
                <option value="Entrada" ${
                  product.tipoMovimentacao === "Entrada" ? "selected" : ""
                }>Entrada</option>
                <option value="Saída" ${
                  product.tipoMovimentacao === "Saída" ? "selected" : ""
                }>Saída</option>
              </select>
              
              <div class="modal-buttons">
                <button type="button" onclick="closeModalInContainer()">Cancelar</button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document
        .getElementById("editProductForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();

          const updatedProductData = {
            nome: document.getElementById("editNome").value,
            preco: parseFloat(document.getElementById("editPreco").value),
            quantidade: parseInt(
              document.getElementById("editQuantidade").value
            ),
            tipoMovimentacao: document.getElementById("editTipoMovimentacao")
              .value,
            categoria: categoryName,
            usuarioId: JSON.parse(sessionStorage.getItem("user")).Id_usuario,
          };

          if (updatedProductData.tipoMovimentacao === "Entrada") {
            updatedProductData.dataEntrada = new Date()
              .toISOString()
              .split("T")[0];
          } else if (updatedProductData.tipoMovimentacao === "Saída") {
            updatedProductData.dataSaida = new Date()
              .toISOString()
              .split("T")[0];
          }
          try {
            const response = await fetch(
              `http://localhost:3000/products/${productId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProductData),
              }
            );

            const result = await response.json();

            if (result.success) {
              closeModalInContainer();
              showToast(result.message);
              fetchCategoryData(categoryName);
            } else {
              showToast(result.message);
            }
          } catch (error) {
            console.error("Erro:", error);
            showToast(
              "Ocorreu um erro ao atualizar o produto. Tente novamente."
            );
          }
        });
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error);
    showToast("Erro ao abrir o modal de edição.");
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function openDeleteModalInContainer(productId) {
  const response = await fetch(`http://localhost:3000/products/${productId}`);
  const product = await response.json();
  const modalContainer = document.getElementById("modalContainer");
  if (modalContainer) {
    modalContainer.innerHTML = `
      <div id="deleteModal" class="modal" style="display: flex;">
        <div class="modal-content">
          <span class="close" onclick="closeModalInContainer()">&times;</span>
          <h2>Deletar Produto</h2>
          <p>Tem certeza de que deseja deletar o produto <strong>${product.Nome}</strong>?</p>
          <div class="modal-buttons">
            <button type="button" onclick="closeModalInContainer()">Cancelar</button>
            <button type="button" id="delete" onclick="confirmDeleteProduct(${product.Id_produto})">Deletar</button>
          </div>
        </div>
      </div>
    `;
  }
}

async function confirmDeleteProduct(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.success) {
      closeModalInContainer();
      showToast(result.message);
      fetchCategoryData(categoryName);
    } else {
      showToast(result.message);
    }
  } catch (error) {
    console.error("Erro:", error);
    showToast("Ocorreu um erro ao deletar o produto. Tente novamente.");
  }
}

function closeModalInContainer() {
  const modalContainer = document.getElementById("modalContainer");
  if (modalContainer) modalContainer.innerHTML = "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

document.getElementById("user-info").addEventListener("click", () => {
  showPage("perfil");
});

document
  .querySelector(".new-btn")
  .addEventListener("click", openCreateModalInContainer);

fetchCategories();

function initializeDashboardPage() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    redirectToLogin();
  }
}

function redirectToLogin() {
  window.location.href = "./Login/index.html";
}

function logoutUser() {
  sessionStorage.removeItem("user");
  redirectToLogin();
}

document.getElementById("logout-btn").addEventListener("click", logoutUser);

window.addEventListener("load", initializeDashboardPage);

function getUser() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    const divUserText = document.querySelector(".user-text");
    const p = divUserText.querySelector("p");
    const span = divUserText.querySelector("span");

    p.textContent = user.Nome;
    span.textContent = user.Email;

    const divTitle = document.querySelector(".title");
    const h3 = divTitle.querySelector("h3");
    h3.textContent = `Bem-Vindo, ${user.Nome}`;
  }
}

getUser();

function openCreateCategoryModal() {
  const modalContainer = document.getElementById("modalContainer");

  if (modalContainer) {
    modalContainer.innerHTML = `
      <div id="createCategoryModal" class="modal" style="display: flex;">
        <div class="modal-content">
          <span class="close" onclick="closeModalInContainer()">&times;</span>
          <h2>Criar Nova Categoria</h2>
          <form id="createCategoryForm">
            <label for="categoryName">Nome da Categoria:</label>
            <input type="text" id="categoryName" name="name" required />

            <div class="modal-buttons">
              <button type="button" onclick="closeModalInContainer()">Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document
      .getElementById("createCategoryForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const categoryName = document.getElementById("categoryName").value;

        const categoryData = { nome: categoryName };

        try {
          const response = await fetch("http://localhost:3000/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
          });

          const result = await response.json();

          if (result.success) {
            closeModalInContainer();
            showToast(result.message);
            fetchCategories();
          } else {
            showToast(result.message);
          }
        } catch (error) {
          console.error("Erro:", error);
          showToast("Ocorreu um erro ao criar a categoria. Tente novamente.");
        }
      });
  }
}

function showProfileTab(tabId) {
  const tabs = document.querySelectorAll(".profile-tab");
  tabs.forEach((tab) => tab.classList.add("hidden"));

  document.getElementById(tabId).classList.remove("hidden");

  document.getElementById("tab-perfil").classList.remove("active");
  document.getElementById("tab-seguranca").classList.remove("active");

  if (tabId === "perfil-info") {
    document.getElementById("tab-perfil").classList.add("active");
  } else {
    document.getElementById("tab-seguranca").classList.add("active");
  }
}

function loadUserProfile() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    document.getElementById("nome").value = user.Nome;
    document.getElementById("email").value = user.Email;
    document.getElementById("cargo").value = user.Cargo;
  }
}

async function saveProfile() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) return;

  const updatedUser = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    cargo: document.getElementById("cargo").value,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/user/${user.Id_usuario}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (response.success) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      showToast(response.message);
    } else {
      showToast(response.message);
    }
  } catch (error) {
    showToast("Erro de rede ao atualizar perfil.");
  }
}

async function saveSecurity() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) return;

  const newPassword = document.getElementById("new-password").value;
  const confirmNewPassword = document.getElementById(
    "confirm-new-password"
  ).value;

  if (newPassword !== confirmNewPassword) {
    showToast("A nova senha e a confirmação não coincidem.");
    return;
  }

  const updatedSecurity = {
    nome: user.Nome,
    email: user.Email,
    cargo: user.Cargo,
    senha: newPassword,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/user/${user.Id_usuario}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSecurity),
      }
    );

    if (response.success) {
      showToast("Senha atualizada com sucesso!");
    } else {
      showToast("Erro ao atualizar senha.");
    }
  } catch (error) {
    showToast("Erro de rede ao atualizar senha.");
  }
}

function openDeleteCategoryModal() {
  const modalContainer = document.getElementById("modalContainer");

  if (modalContainer) {
    modalContainer.innerHTML = `
      <div id="deleteCategoryModal" class="modal" style="display: flex;">
        <div class="modal-content">
          <span class="close" onclick="closeModalInContainer()">&times;</span>
          <h2>Deletar Categoria</h2>
          <p>Para deletar a categoria, por favor, digite o nome da categoria abaixo:</p>
          <form id="deleteCategoryForm">
            <label for="confirmCategoryName">Nome da Categoria:</label>
            <input type="text" id="confirmCategoryName" name="confirmCategoryName" placeholder="Digite o nome da categoria" required />

            <div class="modal-buttons">
              <button type="button" onclick="closeModalInContainer()">Cancelar</button>
              <button id="delete" type="submit">Deletar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document
      .getElementById("deleteCategoryForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const inputCategoryName = document
          .getElementById("confirmCategoryName")
          .value.trim();

        try {
          const response = await fetch(
            `http://localhost:3000/categories/${inputCategoryName}`,
            {
              method: "DELETE",
            }
          );

          const result = await response.json();

          if (result.success) {
            closeModalInContainer();
            showToast(result.message);
            fetchCategories();
          } else {
            showToast(result.message);
          }
        } catch (error) {
          console.error("Erro:", error);
          showToast("Ocorreu um erro ao deletar a categoria. Tente novamente.");
        }
      });
  }
}

window.showPage = showPage;
window.closeModalInContainer = closeModalInContainer;
window.openCreateCategoryModal = openCreateCategoryModal;
window.openEditModalInContainer = openEditModalInContainer;
window.openDeleteModalInContainer = openDeleteModalInContainer;
window.showProfileTab = showProfileTab;
window.saveProfile = saveProfile;
window.saveSecurity = saveSecurity;
window.openDeleteCategoryModal = openDeleteCategoryModal;
window.confirmDeleteProduct = confirmDeleteProduct;
