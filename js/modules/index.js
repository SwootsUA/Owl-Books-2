export async function getAllData() {
    return new Promise(async (resolve) => {
    
        let response = await fetch(`http://localhost:2210/search?name=`)
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