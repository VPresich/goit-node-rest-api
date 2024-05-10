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
  subscription = 'business'   /* from enum: ['starter', 'pro', 'business'] */
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

Створи гілку 04-auth з гілки main.

Додай логіку аутентифікації / авторизації користувача через JWT.

Крок 1
У коді створи схему і модель користувача для колекції users.
{
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
}

Зміни схему контактів, щоб кожен користувач бачив тільки свої контакти. Для цього в схемі контактів додайте властивість

   owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }

Примітка: 'users' - назва колекції, у якій зберігаються користувачі

Крок 2
Реєстрація
Створити ендпоінт /users/register 

Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

У разі успішної валідації в моделі User створити користувача за даними, які пройшли валідацію. Для засолювання паролів використовуй bcrypt або bcryptjs
Якщо пошта вже використовується кимось іншим, повернути Помилку Conflict.
В іншому випадку повернути Успішна відповідь.

Registration request

POST /users/register
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}

Registration validation error

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}

Registration conflict error
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "Email in use"
}

Registration success response

Status: 201 Created
Content-Type: application/json
ResponseBody: {
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}

Login

Створити ендпоінт /users/login

В моделі User знайти користувача за email.

Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

В іншому випадку, порівняти пароль для знайденого користувача, якщо паролі збігаються створити токен, зберегти в поточному юзера і повернути Успішна відповідь.

Якщо пароль або імейл невірний, повернути Помилку Unauthorized.

Login request

POST /users/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}

Login validation error

Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}

Login success response

Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}

Login auth error
Status: 401 Unauthorized
ResponseBody: {
  "message": "Email or password is wrong"
}

Крок 3
Перевірка токена
Створи мідлвар для перевірки токена і додай його до всіх раутів, які повинні бути захищені.
Мідлвар бере токен з заголовків Authorization, перевіряє токен на валідність.

У випадку помилки повернути Помилку Unauthorized.
Якщо валідація пройшла успішно, отримати з токена id користувача. Знайти користувача в базі даних з цим id.

Якщо користувач існує і токен збігається з тим, що знаходиться в базі, записати його дані в req.user і викликати next().

Якщо користувача з таким id НЕ існує або токени не збігаються, повернути Помилку Unauthorized

Middleware unauthorized error

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

Крок 4
Logout

Створити ендпоінт /users/logout
Додай в маршрут мідлвар перевірки токена.

У моделі User знайти користувача за _id.

Якщо користувача не існує повернути Помилку Unauthorized.
В іншому випадку, видалити токен у поточного юзера і повернути Успішна відповідь.
Logout request
POST /users/logout
Authorization: "Bearer {{token}}"

Logout unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

Logout success response
Status: 204 No Content
Крок 5
Поточний користувач - отримати дані юзера по токені
Створити ендпоінт /users/current
Додай в раут мідлвар перевірки токена.
Якщо користувача не існує повернути Помилку Unauthorized
В іншому випадку повернути Успішну відповідь

Current user request
GET /users/current
Authorization: "Bearer {{token}}"

Current user unauthorized error

Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

Current user success response

Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}


Додаткове завдання - необов'язкове

Зробити пагінацію для колекції контактів (GET /contacts?page=1&limit=20).
Зробити фільтрацію контактів по полю обраного (GET /contacts?favorite=true)

Оновлення підписки (subscription) користувача через ендпоінт PATCH /users. Підписка повинна мати одне з наступних значень ['starter', 'pro', 'business']
{
"subscription": "pro"
}