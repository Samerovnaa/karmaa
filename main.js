let cartItems = [];
let totalSum = 0;
function escapeMarkdown(text) {
    const escapeChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
    escapeChars.forEach(char => {
        text = text.split(char).join(`\\${char}`);
    });
    return text;
}
function toggleMenu() {
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");

if (sideMenu.style.left === "0px") {
sideMenu.style.left = "-250px"; // Закрываем меню
menuOverlay.style.display = "none"; // Убираем затемнение
} else {
sideMenu.style.left = "0px"; // Открываем меню
menuOverlay.style.display = "block"; // Показываем затемнение
}
}
function updatePrice(product, pricePerGram) {
    const weight = document.getElementById(`weight-${product}`).value;
    const priceDisplay = document.getElementById(`price-${product}`);
    priceDisplay.textContent = `Ціна: ${weight * pricePerGram} грн`;
}

function addToCart(product, weight, price) {
const cartItemsContainer = document.getElementById("cart-items");
const item = document.createElement("div");
item.textContent = `${product} - ${weight} г - ${price} грн`;
cartItemsContainer.appendChild(item);

cartItems.push({ product, weight, price });
totalSum += Number(price);
document.getElementById("cart-total").textContent = `Загальна сума: ${totalSum} грн`;

document.getElementById("cart-overlay").style.display = "block";
}
function clearCart() {
document.getElementById("cart-items").innerHTML = "";
totalSum = 0;
cartItems = [];
document.getElementById("cart-total").textContent = `Загальна сума: 0 грн`;
}

function closeCart() {
document.getElementById("cart-overlay").style.display = "none";
}

function processPayment() {
if (totalSum === 0) {
    alert("Ваш кошик порожній! Додайте товари перед оплатою.");
    return;
}
const paymentLink = `https://send.monobank.ua/jar/8DC94Zud51?amount=${totalSum * 100}`; // Сумма в копейках
window.open(paymentLink, "_blank");
}
function submitOrder() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const warehouse = document.getElementById("warehouse").value;
    const paymentMethod = document.getElementById("payment-method").value;
    if (!name || !phone || !city || !warehouse) {
        alert('Будь ласка, заповніть усі поля форми!');
        return;
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
        alert('Введіть коректний номер телефону!');
        return;
    }
    // Формируем сообщение
    const message = `
    *Нове замовлення:*
    - 👤 Ім'я: ${escapeMarkdown(name)}
    - 📞 Телефон: ${escapeMarkdown(phone)}
    - 🏙️ Населений пункт: ${escapeMarkdown(city)}
    - 📦 Відділення/Поштомат: ${escapeMarkdown(warehouse)}
    - 💳 Спосіб оплати: ${escapeMarkdown(paymentMethod)}
    - 🛒 Товари:
    ${cartItems.map(item => `   - ${escapeMarkdown(item.product)} - ${item.weight}г - ${item.price} грн`).join("\n")}
    - 💰 Загальна сума: ${totalSum} грн
`;
    // Telegram API
    const botToken = "7444999919:AAHIfYoQKA03eOD9tqugcBV4SZpo_pfo94M";
    const chatId = "542161788"; // Ваш chat_id
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
        }),
    })
    .then(response => {
        if (response.ok) {
            alert("Замовлення успішно відправлено!");
            clearCart();
            closeCart();
            document.getElementById("name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("city").value = "";
            document.getElementById("warehouse").value = "";
            document.getElementById("payment-method").value = "На сайті"; // Сбрасывает на значение по умолчанию
        } else {
            response.text().then(errorText => {
                console.error("Помилка сервера:", errorText);
                alert("Сталася помилка. Спробуйте ще раз.");
            });
        }
    })
    .catch(error => {
        console.error("Помилка:", error);
        alert("Не вдалося відправити замовлення. Перевірте підключення до Інтернету.");
    });    