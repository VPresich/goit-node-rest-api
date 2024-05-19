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

/7
GET http://localhost:port/api/users/verify/:verificationToken
//for verification email 

8/
POST http://localhost:port/api/users/verify

//for reVerification email 
body: 
{
  "email": "111111@111111.net"  
}


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
GET http://localhost:port/api/contacts/:id

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
GET http://localhost:port/api/contacts/:id

Header
Authorization: "Bearer token"

5/
PUT http://localhost:port/api/contacts/:id

Header
Authorization: "Bearer token"
Body
{    
  "name": "contact-name-1",  
  "email": "contact_email_1@111.com",
  "phone": "(111) 111-1111"
}

6/ 
DELETE http://localhost:port/api/contacts/:id
Headers
Authorization: "Bearer token"

7/
PATCH http://localhost:port/api/contacts/:id/favorite

Header
Authorization: "Bearer token"
Body
{ 
  "favotite": false/true
}


ТЗ -
Крок 1 Створи гілку hw06-email з гілки master.
Крок 2 Створення ендпоінта для верифікації email

Додати в модель User два поля verificationToken і verify. Значення поля verify рівне false означатиме, що його email ще не пройшов верифікацію
{
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}

• створити ендпоінт GET /users/verify/:verificationToken(# verification-request), де по параметру verificationToken ми будемо шукати користувача в моделі User

• якщо користувач з таким токеном не знайдений, необхідно повернути Помилку 'Not Found'

• якщо користувач знайдений - встановлюємо verificationToken в null, а поле verify ставимо рівним true в документі користувача і повертаємо Успішну відповідь

Verification request

GET /auth/verify/:verificationToken

Verification user Not Found

Status: 404 Not Found
ResponseBody: {
  message: 'User not found'
}

Verification success response

Status: 200 OK
ResponseBody: {
  message: 'Verification successful',
}

Крок 3

Додавання відправки email користувачу з посиланням для верифікації
При створення користувача при реєстрації:

• створити verificationToken для користувача і записати його в БД (для генерації токена використовуйте пакет uuid або nanoid)

• відправити email на пошту користувача і вказати посилання для верифікації email'а ( /users/verify/:verificationToken) в повідомленні

• Так само необхідно враховувати, що тепер логін користувача не дозволено, якщо не верифікувано email

Крок 4

Додавання повторної відправки email користувачу з посиланням для верифікації

Необхідно передбачити, варіант, що користувач може випадково видалити лист. Воно може не дійти з якоїсь причини до адресата. Наш сервіс відправки листів під час реєстрації видав помилку і т.д.

POST /users/verify

• Отримує body в форматі {email}

• Якщо в body немає обов'язкового поля email, повертає json з ключем {"message":"missing required field email"} і статусом 400

• Якщо з body все добре, виконуємо повторну відправку листа з verificationToken на вказаний email, але тільки якщо користувач не верифікований

• Якщо користувач вже пройшов верифікацію відправити json з ключем {"message":"Verification has already been passed"} зі статусом 400 Bad Request

Resending an email request
POST /users/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}

Resending an email validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody:  {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}

Resending an email success response

Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}

Resend email for verified user
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}

Як альтернативу SendGrid можна використовувати пакет nodemailer
