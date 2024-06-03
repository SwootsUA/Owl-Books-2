import { buildRequestString } from "./input-check.js";

export async function fetchSearchData() {
    return new Promise(async (resolve) => {
        const searchParams = new URLSearchParams(window.location.search);
        const name = searchParams.get('s');
        const book_type = searchParams.get('t');
        const genre = searchParams.get('g');
        const author = searchParams.get('a');
        const publisher = searchParams.get('p');
        const orderby = searchParams.get('o');

        console.log(name, book_type, genre, author, publisher, orderby);
        const tittle = document.querySelector('.tittle');

        var params = {
            book_type: book_type,
            genre: genre,
            author: author,
            publisher: publisher,
        }

        const paramsQuery = buildRequestString('http://localhost:2210/params', params)
        let paramsResponse = await fetch(paramsQuery);
        let paramsNames = await paramsResponse.json();
        console.log(paramsNames);

        if(name != null) { 
            tittle.innerHTML += "\tНазва: " + name;
        }

        if(paramsNames.author_name != null) { 
            tittle.innerHTML += "\tАвтор: " + paramsNames.author_name;
        }

        if(paramsNames.book_format != null) { 
            tittle.innerHTML += "\tФормат: " + paramsNames.book_format;
        }

        if(paramsNames.publisher_name != null) { 
            tittle.innerHTML += "\tВидавництво: " + paramsNames.publisher_name;
        }

        if(paramsNames.genre_name != null) { 
            tittle.innerHTML += "\tЖанр: " + paramsNames.genre_name;
        }

        params.name = name;
        params.orderby = orderby;

        const query = buildRequestString('http://localhost:2210/search', params);
        console.log(query);

        let response = await fetch(query);
        
        let data = await response.json();
        
        var length = data.length;

        const search_row = document.querySelector('.items__row');

        for (const item of data) {
            response = await fetch(`http://localhost:2210/image?imgName=${item.image}`);
            
            let blob = await response.blob();
            let image = URL.createObjectURL(blob);
            
            search_row.innerHTML +=
            `
            <div class=\"item\">
                <div class=\"item__content\">
                    <a class=\"item__href\"  href=\"./item.html?id=${item.book_id}\">
                        <img class=\"item_image\" src=\"${image}\" alt=\"${item.name}\">
                        <div id=\"${item.book_id}\" class=\"item__content__name\">
                            ${item.name}
                        </div>
                    </a>
                    <div class=\"item__content__row\">
                        <div class=\"item__content__collum\">
                            <div class=\"item__content__price\">
                                ${item.price} грн
                            </div>
                        </div>
                        ${item.quantity > 0 ? `
                        <button class="button__buy">
                        Купити
                        </button>` : `
                        <div class="text-error center">Немає в наявності</div>
                        <button class="button__buy display_none">
                        Купити
                        </button>`}
                    </div>
                </div>
            </div>
            `;
            length = length - 1;
        };
        
        if(length = 1){ resolve(); }
    });
}