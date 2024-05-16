Users:
1/
POST http://localhost:port/api/users/register
body: 
{
  "email": "111111@111111.net",
  "password": "111111"
}

2/
POST http://localhost:port/api/users/login

body: 
{
  "email": "111111@111111.net",
  "password": "111111"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2UyOGQ4MzdhYzQwMjA2N2E0ZmQ4MyIsImlhdCI6MTcxNTM0OTc0NSwiZXhwIjoxNzE1MzUzMzQ1fQ.D2AMZVheKvxp_Yjn_vpBBBcoQtsvm_1cW8mQ6of61Z4

3/
POST http://localhost:port/api/users/logout
Headers
Authorization: "Bearer token"

4/ 
GET http://localhost:port/api/users/current

Headers
Authorization: "Bearer token"
 
5/ 
PATCH http://localhost:port/api/users
Headers
Authorization: "Bearer token"
Body 
{
  "subscription": "business"
}  
  /* from enum: ['starter', 'pro', 'business'] */

6/ 
PATCH http://localhost:port/api/users/avatars
Headers
Authorization: "Bearer token"
Content-Type: multipart/form-data
RequestBody: завантажений файл

// for frontend - https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData

Contacts:
1/ 
GET http://localhost:port/api/contacts?favorite=true&name=search&page=number&limit=number

Header
Authorization: "Bearer token"

Parameters
favorite: true/false
name: 'search' (String)
page: 1,
limit: 20

Example for JS Script (with axios)
/*
//const url = 'http://localhost:3000/api/contacts?favorite=true&name=john';

const token = 'token';

import axios from 'axios';
const params = {
  headers: {
    Authorization: `Bearer ${token}`,
  }
  favorite: true, 
  name: 'John', 
  page: 1, 
  limit: 10, 
};
axios
  .get('http://localhost:3000/api/contacts', { params })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
*/

2/
GET http://localhost:port/api/contacts/id

Header
Authorization: "Bearer token"

3/
POST http://localhost:port/api/contacts

Header
Authorization: "Bearer token"

Body
{
  "name": "contact-name-1",  
  "email": "contact_email_1@111.com",
  "phone": "(111) 111-1111"
}

4/
GET http://localhost:port/api/contacts/id

Header
Authorization: "Bearer token"

5/
PUT http://localhost:port/api/contacts/id

Header
Authorization: "Bearer token"
Body
{    
  "name": "contact-name-1",  
  "email": "contact_email_1@111.com",
  "phone": "(111) 111-1111"
}

6/ 
DELETE http://localhost:port/api/contacts/id
Headers
Authorization: "Bearer token"

7/
PATCH http://localhost:port/api/contacts/id/favorite

Header
Authorization: "Bearer token"
Body
{ 
  "favotite": false/true
}


TЗ - План виконання:

Створи гілку hw05-avatars з гілки master.

Продовж створення REST API для роботи з колекцією контактів. Додай можливість завантаження аватарки користувача через Multer.

Крок 1
Створи папку public для роздачі статики. У цій папці зроби папку avatars.
Налаштуй Express на роздачу статичних файлів з папки public.
Поклади будь-яке зображення в папку public/avatars і перевір, що роздача статики працює.
При переході по такому URL браузер відобразить зображення. 
Shell http://localhost:3000/avatars/6645b5c86d5e021917f8876eavatar.jpg 

Крок 2
У схему користувача додай нову властивість avatarURL для зберігання зображення.
{ 
  avatarURL: String, 
}
Використовуй пакет gravatar для того, щоб при реєстрації нового користувача відразу згенерувати йому аватар по його email.

Крок 3
При реєстрації користувача:
• Створюй посилання на аватарку користувача за допомогою gravatar
• Отриманий URL збережи в поле avatarURL під час створення користувача

Крок 4
Додай можливість поновлення аватарки, створивши ендпоінт /users/avatars і використовуючи метод PATCH.
PATCH /users/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: завантажений файл

# Успішна відповідь
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "avatarURL": "тут буде посилання на зображення"
}

# Неуспішна відповідь
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
Створи папку tmp в корені проекту і зберігай в неї завантажену аватарку.

• Оброби аватарку пакетом jimp і постав для неї розміри 250 на 250

• Перенеси аватарку користувача з папки tmp в папку public/avatars і дай їй унікальне ім'я для конкретного користувача.

• Отриманий URL /avatars/<ім'я файлу з розширенням> та збережи в поле avatarURL користувача


Додаткове завдання - необов'язкове

Написати unit-тести для контролера входу (логін)
За допомогою Jest

• відповідь повина мати статус-код 200

• у відповіді повинен повертатися токен

• у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String