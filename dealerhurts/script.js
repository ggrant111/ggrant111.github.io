document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('updated_eleadPriceList.json').then(resp => resp.json()),
        fetch('hurts.json').then(resp => resp.json())
    ])
    .then(([productData, hurtsData]) => {
        initialize(productData, hurtsData.dealerHurts);
    })
    .catch(error => console.error('Error loading JSON:', error));
});

function initialize(productData, hurtsList) {
    const dealerHurtToProductsMap = {};
    const selectedHurts = new Set();

    productData.forEach(category => {
        Object.values(category).forEach(products => {
            products.forEach(product => {
                if (product['Dealer Hurts']) {
                    const productHurts = product['Dealer Hurts'].split(',').map(hurt => hurt.trim());
                    productHurts.forEach(hurt => {
                        dealerHurtToProductsMap[hurt] = dealerHurtToProductsMap[hurt] || [];
                        dealerHurtToProductsMap[hurt].push({
                            description: product['CDK DESCRIPTION'],
                            details: {
                                Description: product['Description'],
                                Hurts: product['Dealer Hurts'],
                                ValueProp: product['Value Prop'],
                                Recurring: product['Recurring'],
                                OneTime: product['One-Time'],
                                Catalog: product['Catalog']
                            }
                        });
                    });
                }
            });
        });
    });

    const dealerHurtContainer = document.getElementById('dealerHurtContainer');
    const selectedProductsContainer = document.getElementById('selectedProductsContainer');

    hurtsList.forEach(hurt => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = hurt;
        card.onclick = () => {
            if (selectedHurts.has(hurt)) {
                selectedHurts.delete(hurt);
                card.classList.remove('selected');
            } else {
                selectedHurts.add(hurt);
                card.classList.add('selected');
            }
            displaySelectedProducts();
        };
        dealerHurtContainer.appendChild(card);
    });

    function displaySelectedProducts() {
        selectedProductsContainer.innerHTML = '';
        const displayedProducts = new Set();

        productData.forEach(category => {
            Object.values(category).forEach(products => {
                products.forEach(product => {
                    if (product['Dealer Hurts']) {
                        const productHurts = product['Dealer Hurts'].split(',').map(hurt => hurt.trim());
                        const hasMatchingHurt = productHurts.some(hurt => selectedHurts.has(hurt));
                        if (hasMatchingHurt && !displayedProducts.has(product['CDK DESCRIPTION'])) {
                            displayedProducts.add(product['CDK DESCRIPTION']);
                            const productCard = document.createElement('div');
                            productCard.className = 'card';
                            productCard.innerHTML = `
                                <h3>${product['CDK DESCRIPTION']}</h3>
                                <p><strong>Catalog #: ${product['CDK CATALOG']}</strong></p>                            
                                <p><strong>Description:</strong> ${product['Description']}</p>
                                <p><strong>Hurts Solved:</strong> ${product['Dealer Hurts']}</p
                                <p><strong>Value Proposition:</strong> ${product['Value Prop']}</p>
                                <p><strong>Recurring Cost: $</strong> ${product['Recurring']}</p>
                                <p><strong>One-Time Cost: $</strong> ${product['One-Time']}</p>
                            `;
                            selectedProductsContainer.appendChild(productCard);
                        }
                    }
                });
            });
        });
    }
}
