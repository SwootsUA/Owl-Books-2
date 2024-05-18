async function fetchItems(url) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    });

    if(response.ok) {
        return response.json();
    } else {
        return null;
    }

}

async function fetchBookDetails(bookId) {
    const response = await fetch(`http://localhost:2210/item?id=${bookId}`);
    return response.json();
}

async function fetchBookImage(imageName) {
    const response = await fetch(`http://localhost:2210/image?imgName=${imageName}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

async function loadUserBooks(bookTypeId, bookType, button_text) {
    const items = await fetchItems(`http://localhost:2210/books?format_id=${bookTypeId}`);

    if(items == null) {
        return;
    }

    const booksSection = document.querySelector(`.user_${bookType}`);
    if (items.length > 0) {
        booksSection.classList.remove('hidden');

        const itemPromises = items.map(async (item) => {
            const data = await fetchBookDetails(item.book_id);
            const image = await fetchBookImage(data.info.image);
            return { item, data, image };
        });

        const resolvedItems = await Promise.all(itemPromises);

        const itemsRow = booksSection.querySelector('.items__row');

        resolvedItems.forEach(({ item, data, image }) => {
            const itemHTML = `
                <div class="item">
                    <div class="item__content">
                        <a class="item__href" href="./item.html?id=${item.book_id}">
                            <img class="item_image" src="${image}" alt="${data.info.name}">
                            <div id="${item.book_id}" class="item__content__name">
                                ${data.info.name}
                            </div>
                        </a>
                        <div class="item__content__row">
                            <div class="item__content__collum">
                                <button book_id=${item.book_id} class="button__buy ${bookType}">${button_text}</button>
                            </div>
                            <button book_id=${item.book_id} class="button__buy ${bookType} download_button">Скачати</button>
                        </div>
                    </div>
                </div>
            `;
            itemsRow.innerHTML += itemHTML;
        });
    }
}

function addEventListenersToTheButtons(bookType, read_func, download_func) {
    console.log('addEventListenersToTheButtons call');
    const readButtons = document.querySelectorAll(`.button__buy.${bookType}`);
    readButtons.forEach(button => {
        console.log(button);
        button.onclick = () => {
            const book_id = button.getAttribute('book_id');
            read_func(book_id);
        };
    });

    const downloadButtons = document.querySelectorAll(`.button__buy.${bookType}.download_button`);
    downloadButtons.forEach(button => {
        console.log(button);
        button.onclick = () => {
            const book_id = button.getAttribute('book_id');
            download_func(book_id);
        };
    });
}

function readEBook(book_id) {
    window.location.href = `http://localhost:2210/pdf?book_id=${book_id}`;
}

function readAudioBook(book_id) {
    window.location.href = `http://localhost:2210/mp3?book_id=${book_id}`;
}

async function downloadEBook(book_id) {
    try {
        const response = await fetch(`http://localhost:2210/pdf?book_id=${book_id}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const disposition = response.headers.get('Content-Disposition');
        let fileName = `ebook_${book_id}.pdf`;
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const matches = /filename="(.+)"/.exec(disposition);
            if (matches != null && matches[1]) {
                fileName = matches[1];
            }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download the ebook:', error);
    }
}

async function downloadAudioBook(book_id) {
    try {
        const response = await fetch(`http://localhost:2210/mp3?book_id=${book_id}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const disposition = response.headers.get('Content-Disposition');
        let fileName = `audioBook_${book_id}.mp3`;
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const matches = /filename="(.+)"/.exec(disposition);
            if (matches != null && matches[1]) {
                fileName = matches[1];
            }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download the audioBook:', error);
    }
}

export async function loadUserEBooks() {
    await loadUserBooks('2', 'eBooks', 'Читати');
    addEventListenersToTheButtons('eBooks', readEBook, downloadEBook);
}

export async function loadUserAudioBooks() {
    await loadUserBooks('3', 'audioBooks', 'Слухати');
    addEventListenersToTheButtons('audioBooks', readAudioBook, downloadAudioBook);
}
