import { clearCart, updateCart } from "./cart.js";
import { userAuth, isAuthorized, userLogOut, updateUserInfoOnServer } from './auth.js';
import { loadUserAudioBooks, loadUserEBooks } from "./user-items.js";

function openSearch(isOpen) {
	var header = document.querySelector('.header');
	var header_logo = document.querySelector('.header__logo');
	var header_user_image = document.querySelector('.header_user_image');
	var searchIcon = document.querySelector('.search__img');
	var searchCross = document.querySelector('.search__cross');
	var searchInput = document.querySelector('.search__input');
	var cartImg = document.querySelector('.cart__img');
	
	header.classList.toggle('search_opened');
	header_logo.classList.toggle('hidden');
	header_user_image.classList.toggle('hidden');
	searchIcon.classList.toggle('hidden');
	searchCross.classList.toggle('hidden');
	searchInput.classList.toggle('active');

	if (!isOpen) {
		setTimeout(() => {cartImg.classList.toggle('hidden')}, 350);
	}
}

function activateCart() {
	var cartImg = document.querySelector('.cart__img');
	var cartText = document.querySelector('.cart__text');
	var cartPopUp = document.querySelector('.cart-popup');
	var popUpContainer = document.querySelector('.cart-popup-container');

	cartImg.classList.toggle('active');
	cartText.classList.toggle('active');
	cartPopUp.classList.toggle('active');
	popUpContainer.classList.toggle('active');
}

export async function buildPage(){
	const footer = document.querySelector('.footer');
	const header = document.querySelector('.header');
	const body = document.querySelector('.body');
	const cartNotification = document.querySelector('.cart-notification');
	const cartPopUp = document.querySelector('.cart-popup');
	const userPage = document.querySelector('.user_page');

	if(cartNotification) {
		cartNotification.innerHTML =
			`
			<div class="cart-notification-container">
				Товар успішно додано у корзину!
			</div>
			`
	}

	const orderPage = document.querySelector('.make-order-delivery');
	console.log(orderPage);

	if(body) {
		cartPopUp.innerHTML =
			`
			<div class="background"></div>
			<div class="cart-popup-container">
				<div class="cart-popup-content">
					<div class="cart-header">
						<div class="cart-header-tittle"> Кошик </div>
						<div class="cart-header-cross">
							<img src="./img/cross.png" alt="close cart">
						</div>
					</div>
					<div class="cart-header">
						<div class="cart-popup-quantity"></div>
						<div class="cart-popup-clear"> Видалити все </div>
					</div>
					<div class="cart-summary">
						<div class="cart-summary-wrapper">
							<div class="cart-summary-group">
								<div class="cart-summary-title">
									Всього
								</div>
								<div class="cart-summary-price"></div>
							</div>
							<button type="button" onclick="window.location='./make-order.html';" class="cart-summary-button">
								Перейти до оформлення замовлення
							</button>
						</div>
					</div>
				</div>
			</div>
			`;

		document.querySelector('.cart-popup-clear').addEventListener('click', clearCart);
		
		await updateCart();

		body.innerHTML = 
			`
			<div class="controls">
				<div class="cart">
					<div class="cart_elements">
						<img class="cart__img" src="./img/cart.png" alt="cart">
						<div class="cart__text">Кошик</div>
					</div>
					<div class="sort_order_select">
						<span class="sort_order_select">Сортувати: </span> 
						<select class="sort_order_select select">
							<option value="none">За замовчуванням</option>
							<option value="alphab_asc">Назва (А - Я)</option>
							<option value="alphab_des">Назва (Я - А)</option>
							<option value="price_asc">Ціна (низька > висока)</option>
							<option value="price_des">Ціна (висока > низька)</option>
						</select>
					</div>
				</div>
				<a class="book_type_a" href="http://localhost:5500/search.html?t=3">Аудіо книги</a>
				<a class="book_type_a" href="http://localhost:5500/search.html?t=2">Електронні книги</a>
				<a class="book_type_a" href="http://localhost:5500/search.html?t=1">Друковані книги</a>
			</div>
			` + body.innerHTML;

		var params = new URLSearchParams(location.search);
		var option = params.get('o');
		var selectElement = document.querySelector('.sort_order_select.select');
			
		for (var i = 0; i < selectElement.options.length; i++) {
			if (selectElement.options[i].value === option) {
				selectElement.options[i].selected = true;
				break;
			}			
		}
		
		const cartImg = document.querySelector('.cart__img');
		const cartText = document.querySelector('.cart__text');
		const cartBackground = document.querySelector('.background');
		const cartCross = document.querySelector('.cart-header-cross');

		const sort_order_select = document.querySelector('.sort_order_select.select');
		sort_order_select.addEventListener('change', () => {
			var location = window.location;
			var itself = document.querySelector('.sort_order_select.select');
			var params = new URLSearchParams(location.search);
			params.set('o', itself.value);
			var newUrl = location.pathname + '?' + params.toString();
			if (location.search.length === 0) {
				newUrl = location.pathname + '?' + params.toString().substring(1);
			}
			if (location.pathname !== "/search.html") {
				newUrl = "/search.html" + (newUrl.length > 0 ? '?' + params.toString() : '');
			}
			window.location.href = newUrl;
		});

		const googleButton = document.querySelector('.gsi-material-button.google-signin-button');
		if (googleButton) {
			googleButton.addEventListener('click', () => { userAuth(); });
		}

		if(userPage) {
			var name, surname, phone, email, region_id, city;
			var prev_name, prev_surname, prev_phone, prev_region_id, prev_city;
			var google_id;

			try {
				document.querySelector('.sort_order_select').classList.add('display_none');
			} catch (error) {
				console.log('userPage: ' + error);
			}

			await isAuthorized().then(user => {
			  var user_page = document.querySelector('.user_page');
			  var user_page_auth = document.querySelector('.user_page_auth');

			  if(user) {
				user_page.classList.remove('hidden');
				google_id = user.google_id;
				
				phone = document.querySelector('.order-input.phone');
				name = document.querySelector('.order-input.name');
				surname = document.querySelector('.order-input.surname');
				email = document.querySelector('.order-input.email');
				region_id = document.querySelector('.order-input.oblast');
				city = document.querySelector('.order-input.city');
				
				if(user.picture)
					document.querySelector('.user_page__image').src = user.picture;
				if(user.name) {
					name.value = user.name;
					prev_name = user.name;
				}
				if(user.surname) {
					surname.value = user.surname;
					prev_surname = user.surname;
				}
				if(user.phone_number) {
					phone.value = user.phone_number;
					prev_phone = user.phone_number;
				}
				if(user.email) {
					email.value = user.email;
				}
				if(user.region_id) {
					region_id.value = user.region_id;
					prev_region_id = user.region_id;
				}
				if(user.city) {
					city.value = user.city;
					prev_city = user.city;
				}

				loadUserEBooks(google_id);
				loadUserAudioBooks(google_id);
			  } else {
				user_page_auth.classList.remove('hidden');
				console.log('User not found');
			  }
			}).catch(error => {
			  console.error(`Error in isAuthorized: ${error}`);
			});

			function saveUserInfo() {
				if (parseInt(phone.value.length) > 15) {
					phone.classList.add('error');
					phone.addEventListener('focus', () => {
						phone.classList.remove('error');
					})
					return;
				}

				function addFieldIfChanged(prevValue, currValue, fieldName, fieldsObject) {
					if (prevValue !== currValue && (currValue != null)) {
						fieldsObject[fieldName] = currValue;
					}
				}

				var fields = {};

				addFieldIfChanged(prev_name, name.value, 'name', fields);
				addFieldIfChanged(prev_surname, surname.value, 'surname', fields);
				addFieldIfChanged(prev_phone, phone.value, 'phone_number', fields);
				addFieldIfChanged(prev_region_id, region_id.value, 'region_id', fields);
				addFieldIfChanged(prev_city, city.value, 'city', fields);

				updateUserInfoOnServer(google_id, fields)
			}

			async function logOut() {
				await userLogOut();
				document.location.href = document.location.href; 
			}

			document.getElementById("save_button").onclick = saveUserInfo;
			document.getElementById("logout_button").onclick = logOut;
		}

		cartImg.addEventListener('click', () => { activateCart(); });
		cartText.addEventListener('click', () => { activateCart(); });
		cartCross.addEventListener('click', () => { activateCart(); });
		cartBackground.addEventListener('click', () => { activateCart(); });
	}

	if(document.querySelector('.item_page')) {
		try {
			document.querySelector('.sort_order_select').classList.add('display_none');
		} catch (error) {
			console.log('userPage: ' + error);
		}
	}

	if(orderPage) {
		console.log('order-page');

		try {
			document.querySelector('.sort_order_select').classList.add('display_none');
		} catch (error) {
			console.log('userPage: ' + error);
		}

		var cart;

		if (!localStorage.getItem("cart")) {
			localStorage.setItem("cart", "[]");
		}

		const region_id = document.querySelector('.order-input.oblast');
		const city = document.querySelector('.order-input.city');
		const novaPoshta = document.querySelector('.order-input.nova-post');
		const phone = document.querySelector('.order-input.phone');
		const regionText = document.querySelector('.contacts-text-content.oblast');
		const cityText = document.querySelector('.contacts-text-content.city');
		const novaPoshtaText = document.querySelector('.contacts-text-content.nova-post');
		const phoneText = document.querySelector('.contacts-text-content.phone');
		var cartHasNoPhysicalBooks = true;

		cart = JSON.parse(localStorage.getItem("cart"));
		const response = await fetch(`http://localhost:2210/cart?ids=${cart.map(obj => obj.id).join(',')}`);
		const products = await response.json();

		for(var i=0; i<products.length; i++) {
			if(products[i].format_id == 1) {
				cartHasNoPhysicalBooks = false;
				break;
			}
		}

		if(cartHasNoPhysicalBooks) {
			region_id.classList.add('display_none');
			city.classList.add('display_none');
			novaPoshta.classList.add('display_none');
			phone.classList.add('display_none');
			phoneText.classList.add('display_none');
			regionText.classList.add('display_none');
			cityText.classList.add('display_none');
			novaPoshtaText.classList.add('display_none');
		}

		await isAuthorized().then(user => {
			if(user) {
			  google_id = user.google_id;
				  
			  name = document.querySelector('.order-input.name');
			  surname = document.querySelector('.order-input.surname');
			  email = document.querySelector('.order-input.email');
			  
			  if(user.name) {
				  name.value = user.name;
			  }
			  if(user.surname) {
				  surname.value = user.surname;
			  }
			  if(user.phone_number) {
				  phone.value = user.phone_number;
			  }
			  if(user.email) {
				  email.value = user.email;
			  }
			  if(user.region_id) {
				  region_id.value = user.region_id;
			  }
			  if(user.city) {
				  city.value = user.city;
			  }
			} else {
			  console.log('not Authorized');
			}
		}).catch(error => {
			console.error(`Error in isAuthorized: ${error}`);
		});
	}

	if(header) {
		header.innerHTML = 
			`
				<form class="search" action="./search.html" method="get">
					<input class="search__input" type="search" name="s" placeholder="Пошук...">
					<img class="search__img" src="./img/search.png" alt="search">
					<img class="search__cross hidden" src="./img/cross.png" alt="close search">	
				</form>
				<a href="./index.html" class="header__logo">
					<img src="./img/logo.png" alt="logo" height="80">
					<div>Owl Books</div>
				</a>
				<a href="./user.html" class="header_user_image">
					<img src="./img/user.png" alt="user_pic" height="80">
				</a>
			`;

		const searchIcon = document.querySelector('.search__img');
		const searchCross = document.querySelector('.search__cross');

		searchIcon.addEventListener('click', () => { openSearch(true); });
		searchCross.addEventListener('click', () => { openSearch(false); });
	}
	
	if(footer) {
		footer.innerHTML = 
			`
			<div class="footer__copyright">© 2023 “Owl Books”</div>
			<div class="footer__about">
				<a class="footer__about__social" href="https://telegram.org">
					<img class="footer__about__social_img" src="./img/teleg.png" alt="telegram">
				</a>
				<a class="footer__about__social" href="https://instagram.com">
					<img class="footer__about__social_img" src="./img/insta.png" alt="instagram">
				</a>
				<a class="footer__about__social" href="https://facebook.com">
					<img class="footer__about__social__img" src="./img/faceb.png" alt="facebook">
				</a>
			</div>
			`
	}	
}  
