// script.js

// Função para alternar entre as páginas principais

// Função para exibir/esconder o dropdown do menu Estoque
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('hidden');
}

// Função para exibir subpágina e destacar item ativo
function showSubPage(pageId) {
    showPage(pageId);

    // Atualiza o item ativo no dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => item.classList.remove('active'));

    const activeItem = document.querySelector(`.dropdown-item[onclick="showSubPage('${pageId}')"]`);
    activeItem.classList.add('active');
}

// Função para abrir/fechar o menu de filtro
function toggleFilterDropdown() {
    const filterMenu = document.getElementById('filter-menu');
    filterMenu.classList.toggle('hidden');
}

// Função para capturar filtros selecionados
function getSelectedFilters() {
    const selectedFilters = [];
    const checkboxes = document.querySelectorAll('#filter-menu input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedFilters.push(checkbox.value);
        }
    });
    console.log("Filtros selecionados:", selectedFilters);
    // Aqui você pode aplicar os filtros selecionados à lista de componentes
}

document.getElementById('user-info').addEventListener('click', () => {
    console.log("Clique em User Info");
    const perfilPage = document.getElementById('perfil');
    console.log(perfilPage);  // Verifique se o elemento está sendo encontrado

    // Mostra a página de perfil
    showPage('perfil');
});

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    console.log("Exibindo página:", pageId);  // Adicionado para depuração
    document.getElementById(pageId).classList.remove('hidden');
}

// Fechar o menu de filtro ao clicar fora dele
window.addEventListener('click', function(event) {
    const filterMenu = document.getElementById('filter-menu');
    const filterButton = document.querySelector('.filter-btn');
    if (!filterMenu.contains(event.target) && !filterButton.contains(event.target)) {
        filterMenu.classList.add('hidden');
    }
});
