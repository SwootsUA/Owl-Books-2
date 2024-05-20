import { isAuthorized } from "./auth.js";
import * as cartModule from "./cart.js";

export function addInputsCheck() {
    let orderButton = document.getElementById('make-order');
    
    orderButton.onclick = async function () {
        let dontContainsError = true;
        
        var cartHasNoPhysicalBooks = true;

        var cart = JSON.parse(localStorage.getItem("cart"));
		const response = await fetch(`http://localhost:2210/cart?ids=${cart.map(obj => obj.id).join(',')}`);
		const products = await response.json();

        for(var i=0; i<products.length; i++) {
			if(products[i].format_id == 1) {
				cartHasNoPhysicalBooks = false;
				break;
			}
		}

        const region_id = document.querySelector('.order-input.oblast');
		const city = document.querySelector('.order-input.city');
		const novaPoshta = document.querySelector('.order-input.nova-post');
        const phone = document.querySelector('.order-input.phone');
        const checkbox = document.getElementById('custom-arrive-date');
        const datePick = document.getElementById('arrive-date');

        if(cartHasNoPhysicalBooks) {
            datePick.classList.add("not_req");
            region_id.removeAttribute("required");
            city.removeAttribute("required");
            novaPoshta.removeAttribute("required");
            phone.removeAttribute("required");
            region_id.classList.add("not_req");
            city.classList.add("not_req");
            novaPoshta.classList.add("not_req");
            phone.classList.add("not_req");
        } else {
            datePick.classList.remove("not_req");
            region_id.setAttribute("required", "true");
            city.setAttribute("required", "true");
            novaPoshta.setAttribute("required", "true");
            phone.setAttribute("required", "true");
            region_id.classList.remove("not_req");
            city.classList.remove("not_req");
            novaPoshta.classList.remove("not_req");
            phone.classList.remove("not_req");
        }

        let orderInputs = document.querySelectorAll('.order-input');

        for (const input of orderInputs) {
            removeError(input);
            
            if (parseInt(input.value.length) === 0 && !input.classList.contains('not_req')) {
                addError(input);
                console.log(input.outerHTML + " has error");
                dontContainsError = false;
            }

            if(input.classList.contains('phone') && parseInt(input.value.length) > 15 && !cartHasNoPhysicalBooks) {
                addError(input);
                dontContainsError = false;
            }

            if (input.classList.contains('oblast') && parseInt(input.value) === 0 && !cartHasNoPhysicalBooks) {
                addError(input);
                dontContainsError = false;
            }

            if (input.classList.contains('email') && emailTest(input)) {
                addError(input);
                dontContainsError = false;
            }
        } 

        removeError(datePick);

        if (checkbox.checked && datePick.value.length < 10 && !cartHasNoPhysicalBooks) {
            addError(datePick);
            dontContainsError = false;
        }

        console.log(dontContainsError);

        let cartHasItem = false;
        if (localStorage.getItem('cart').length > 2)
            cartHasItem = true;

        if (dontContainsError && cartHasItem) {       
            let cart = localStorage.getItem("cart");
            
            var google_id = '0';

            await isAuthorized().then(user => {
                if(user) {
                  google_id = user.google_id; 
                }
            });

            const params = {
                google_id: google_id,
                name: document.querySelector('.name').value,
                surname: document.querySelector('.surname').value,
                phone_number: document.querySelector('.phone').value,
                email: document.querySelector('.email').value,
                region_id: document.querySelector('.oblast').value,
                city: document.querySelector('.city').value,
                NovaPoshta: document.getElementById('nova-post').value,
                description: document.querySelector('.description').value,
                pickUpDate: document.getElementById('arrive-date').value,
                content: cart
            };
            
            const requestString = buildRequestString('http://localhost:2210/add-order', params);

            await fetch(requestString)
                .then((result) => {
                    if(result.ok) {
                        activatePopUp();
                    } else {
                        activateErrorPopUp();
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                    activateErrorPopUp();
                    return; 
                });   
        }
    };

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    function addError(input) {
        input.classList.add('error');
    }

    function removeError(input) {
        input.classList.remove('error');
    }

    function activateErrorPopUp() {
        let popUp = document.querySelector('.popup-order-error');
        popUp.classList.add('active');
        popUp.onclick = function () {
            popUp.classList.remove('active');
        };
    }

    function activatePopUp() {
        let popUp = document.querySelector('.popup-order-succeed');
        popUp.classList.add('active');
        popUp.onclick = function () {
            popUp.classList.remove('active');
        };
        cartModule.clearCart();
    }   
}

export function buildRequestString(baseUrl, params) {
  const queryString = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== "" && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&'); 
  return `${baseUrl}?${queryString}`;
}