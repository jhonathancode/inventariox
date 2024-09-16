document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productQuantityInput = document.getElementById('product-quantity');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = productIdInput.value;
        const name = productNameInput.value;
        const quantity = productQuantityInput.value;

        if (id) {
            updateProduct(id, name, quantity);
        } else {
            addProduct(name, quantity);
        }
    });

    function fetchProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                productList.innerHTML = '';
                data.forEach(product => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${product.name} (${product.quantity})</span>
                        <button class="delete" onclick="deleteProduct(${product.id})">Eliminar</button>
                        <button onclick="editProduct(${product.id}, '${product.name}', ${product.quantity})">Editar</button>
                    `;
                    productList.appendChild(li);
                });
            });
    }

    window.deleteProduct = function(id) {
        fetch(`/api/products/${id}`, { method: 'DELETE' })
            .then(() => fetchProducts());
    }

    window.editProduct = function(id, name, quantity) {
        productIdInput.value = id;
        productNameInput.value = name;
        productQuantityInput.value = quantity;
    }

    function addProduct(name, quantity) {
        fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity })
        }).then(() => {
            productNameInput.value = '';
            productQuantityInput.value = '';
            fetchProducts();
        });
    }

    function updateProduct(id, name, quantity) {
        fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity })
        }).then(() => {
            productIdInput.value = '';
            productNameInput.value = '';
            productQuantityInput.value = '';
            fetchProducts();
        });
    }

    fetchProducts();
});
