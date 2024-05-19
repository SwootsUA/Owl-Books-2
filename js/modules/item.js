export async function fetchItemData() {
    return new Promise(async (resolve) => {
        const searchParams = new URLSearchParams(window.location.search);
        const itemId = searchParams.get('id');

        let response = await fetch(`http://localhost:2210/item?id=${itemId}`);
        let data = await response.json();

        const itemContainer = document.querySelector('.item_page');
        document.title = data.info.name;

        var image;

        console.log(data);

        let genres = data.genres.length === 1 ? 'Жанр: ' : 'Жанри: ';
        data.genres.forEach((genre, index) => {
            genres += `<a href="http://localhost:5500/search.html?g=${genre.genre_id}">${genre.name}</a>${index < data.genres.length - 1 ? ', ' : ''}`;
        });

        let authors = data.authors.length == 1 ? 'Автор: ' : 'Автори: ';
        data.authors.forEach((author, index) => {
            authors += `<a href="http://localhost:5500/search.html?a=${author.author_id}">${author.name}</a>${index < data.authors.length - 1 ? ', ' : ''}`;
        });

        const itemQuantity = data.info.quantity > 0 
        ? `<div class="item_page__more_info"> Одиниць на складі: <span id="item_quantity">${data.info.quantity}</span></div>` 
        : `<div class="item_page__more_info text-error"> Немає в наявності <span id="item_quantity" class="display_none">${data.info.quantity}</span></div>`;    

        const itemPageBuy = data.info.quantity > 0 ? 
        `
            <div id=${data.info.book_id} class="item_page__buy product-id">
                <button class="button__buy" id="item_page">Купити</button>
                ${data.info.format_id !== 2 && data.info.format_id !== 3 ? 
                    `<input type="number" min="1" max="100" value="1" class="item_page-product-quantity-input">` 
                    : ''
                }
                <div class="item_page__price">${data.info.price} грн</div>
            </div>
        ` : 
        `
            <div id=${data.info.book_id} class="item_page__buy product-id">
                <button class="button__buy display_none" id="item_page">Купити</button>
                ${data.info.format_id !== 2 && data.info.format_id !== 3 ? 
                    `<input type="number" min="1" max="100" value="1" class="item_page-product-quantity-input display_none">` 
                    : ''
                }
                <div class="item_page__price">${data.info.price} грн</div>
            </div>
        `;


        response = await fetch(`http://localhost:2210/image?imgName=${data.info.image}`);
        let blob = await response.blob();
        image = URL.createObjectURL(blob);

        var html;

        if(data.info.format_id == 1) {
            html = `
            <div class="item_page__image_container">
                <img class="item_page__image" src="${image}" alt="${data.info.name}">
            </div>
            <div class="item_page__info_container">
                <div class="item_page__info">
                    <div class="item_page__name" id="${data.info.book_id}">
                        ${data.info.name}
                    </div>
                    <div class="item_page__more_info">
                        ${authors}
                    </div>
                    <div class="item_page__more_info">
                        ${genres}
                    </div>
                    <div class="item_page__more_info">
                        Кількість сторінок: ${data.info.page_amount}
                    </div>
                    <div class="item_page__more_info">
                        Видавництво: <a href="http://localhost:5500/search.html?p=${data.info.pub_id}">${data.info.pub_name}</a>
                    </div>
                    <div class="item_page__more_info">
                        ISBN: ${data.info.ISBN}
                    </div>
                    
                    ${itemQuantity}
    
                    <div class="item_page__description">
                        <p>${data.info.description}
                    </div>
                    
                </div>
                ${itemPageBuy}
            </div>
            `
        } else if(data.info.format_id == 2) {
            html = `
            <div class="item_page__image_container">
                <img class="item_page__image" src="${image}" alt="${data.info.name}">
            </div>
            <div class="item_page__info_container">
                <div class="item_page__info">
                    <div class="item_page__name" id="${data.info.book_id}">
                        ${data.info.name}
                    </div>
                    <div class="item_page__more_info">
                        ${authors}
                    </div>
                    <div class="item_page__more_info">
                        ${genres}
                    </div>
                    <div class="item_page__more_info">
                        Кількість сторінок: ${data.info.page_amount}
                    </div>
                    <div class="item_page__more_info">
                        Видавництво: ${data.info.pub_name}
                    </div>
                    <div class="item_page__more_info">
                        ISBN: ${data.info.ISBN}
                    </div>  
                    <div class="item_page__description">
                        <p>${data.info.description}
                    </div>
                </div>
                ${itemPageBuy}
            </div>
            `
        } else if(data.info.format_id == 3) {
            const pad = (num) => String(num).padStart(2, '0');
            var time = data.info.page_amount >= 3600
                ? `${pad(Math.floor(data.info.page_amount / 3600))}:${pad(Math.floor((data.info.page_amount % 3600) / 60))}:${pad(data.info.page_amount % 60)}`
                : `${pad(Math.floor(data.info.page_amount / 60))}:${pad(data.info.page_amount % 60)}`;
            html = `
            <div class="item_page__image_container">
                <img class="item_page__image" src="${image}" alt="${data.info.name}">
            </div>
            <div class="item_page__info_container">
                <div class="item_page__info">
                    <div class="item_page__name" id="${data.info.book_id}">
                        ${data.info.name}
                    </div>
                    <div class="item_page__more_info">
                        ${authors}
                    </div>
                    <div class="item_page__more_info">
                        ${genres}
                    </div>
                    <div class="item_page__more_info">
                        Довижина: ${time}
                    </div>
                    <div class="item_page__more_info">
                        Видавництво: ${data.info.pub_name}
                    </div>
                    <div class="item_page__description">
                        <p>${data.info.description}
                    </div>
                </div>
                ${itemPageBuy}
            </div>
            `
        }

        itemContainer.innerHTML = html;

        resolve();
    })
}