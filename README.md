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

Змініть схему контактів, щоб кожен користувач бачив тільки свої контакти. Для цього в схемі контактів додайте властивість

   owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }

Примітка: 'users' - назва колекції, у якій зберігаються користувачі

Крок 2
Регістрація
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



Логін



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



Логаут



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

{"email": "111111@111111.net",
"password": "111111"}


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2RmYzkyZDE3MTI3ODUzZTFiM2Q4YSIsImlhdCI6MTcxNTMzODQwNCwiZXhwIjoxNzE1MzQyMDA0fQ.dhPO8DG21Uurb6OovBbW83vqXtOdmJT_JQZltNYsejw


{
 "name": "contact-name-1",  
  "email": "contact_email_1@111.com",
  "phone": "(111) 111-1111"
}


[
    {
        "_id": "6638841c223fae507e829844",
        "name": "Allen Raymond",
        "email": "nulla.ante@vestibul.co.uk",
        "phone": "(992) 914-3792",
        "favorite": false,
        "__v": 0
    },
    {
        "_id": "66388421223fae507e829846",
        "name": "Allen Raymond",
        "email": "nulla.ante@vestibul.co.uk",
        "phone": "(992) 914-3792",
        "favorite": true,
        "__v": 0
    },
    {
        "_id": "663d64424f9f16f5346dc8f6",
        "name": "Kennedy Lane",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d644e4f9f16f5346dc8f8",
        "name": "Kennedy Lane-1",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64534f9f16f5346dc8fa",
        "name": "Kennedy Lane-2",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64584f9f16f5346dc8fc",
        "name": "Kennedy Lane-3",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d645d4f9f16f5346dc8fe",
        "name": "Kennedy Lane-4",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64624f9f16f5346dc900",
        "name": "Kennedy Lane-5",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64674f9f16f5346dc902",
        "name": "Kennedy Lane-6",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d646b4f9f16f5346dc904",
        "name": "Kennedy Lane-7",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d646f4f9f16f5346dc906",
        "name": "Kennedy Lane-8",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64744f9f16f5346dc908",
        "name": "Kennedy Lane-9",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64794f9f16f5346dc90a",
        "name": "Kennedy Lane-10",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d647f4f9f16f5346dc90c",
        "name": "Kennedy Lane-11",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64834f9f16f5346dc90e",
        "name": "Kennedy Lane-12",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64884f9f16f5346dc910",
        "name": "Kennedy Lane-13",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d648d4f9f16f5346dc912",
        "name": "Kennedy Lane-14",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64924f9f16f5346dc914",
        "name": "Kennedy Lane-15",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d64974f9f16f5346dc916",
        "name": "Kennedy Lane-16",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663d649d4f9f16f5346dc918",
        "name": "Kennedy Lane-17",
        "email": "ttis.Cras@nonenimMauris.net",
        "phone": "(542) 451-7038",
        "favorite": true
    },
    {
        "_id": "663dfe4337c534cdc5c41dba",
        "name": "contact-name-1",
        "email": "contact_email_1@111.com",
        "phone": "(111) 111-1111",
        "favorite": false,
        "createdAt": "2024-05-10T11:00:19.947Z",
        "updatedAt": "2024-05-10T11:00:19.947Z"
    },
    {
        "_id": "663dff2f37c534cdc5c41dbd",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(222) 222-2222",
        "favorite": false,
        "createdAt": "2024-05-10T11:04:15.909Z",
        "updatedAt": "2024-05-10T11:04:15.909Z"
    },
    {
        "_id": "663e00007d8a61ad1137930b",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(222) 222-2222",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:07:44.686Z",
        "updatedAt": "2024-05-10T11:07:44.686Z"
    },
    {
        "_id": "663e007490d6e144c39f431d",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(222) 222-2222",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:09:40.930Z",
        "updatedAt": "2024-05-10T11:09:40.930Z"
    },
    {
        "_id": "663e011290d6e144c39f4320",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:12:18.405Z",
        "updatedAt": "2024-05-10T11:12:18.405Z"
    },
    {
        "_id": "663e033a0cbebf93549cdefe",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:21:30.886Z",
        "updatedAt": "2024-05-10T11:21:30.886Z"
    },
    {
        "_id": "663e039e1f560f8e87ec73c3",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:23:10.924Z",
        "updatedAt": "2024-05-10T11:23:10.924Z"
    },
    {
        "_id": "663e045d0197ea0466b62c7e",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:26:21.170Z",
        "updatedAt": "2024-05-10T11:26:21.170Z"
    },
    {
        "_id": "663e04db7d4e5cfffb507db4",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:27.152Z",
        "updatedAt": "2024-05-10T11:28:27.152Z"
    },
    {
        "_id": "663e04ea7d4e5cfffb507db7",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:42.663Z",
        "updatedAt": "2024-05-10T11:28:42.663Z"
    },
    {
        "_id": "663e04ed7d4e5cfffb507dba",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:45.634Z",
        "updatedAt": "2024-05-10T11:28:45.634Z"
    },
    {
        "_id": "663e04ee7d4e5cfffb507dbd",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:46.807Z",
        "updatedAt": "2024-05-10T11:28:46.807Z"
    },
    {
        "_id": "663e04ef7d4e5cfffb507dc0",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:47.744Z",
        "updatedAt": "2024-05-10T11:28:47.744Z"
    },
    {
        "_id": "663e04f07d4e5cfffb507dc3",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:48.688Z",
        "updatedAt": "2024-05-10T11:28:48.688Z"
    },
    {
        "_id": "663e04f17d4e5cfffb507dc6",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:49.753Z",
        "updatedAt": "2024-05-10T11:28:49.753Z"
    },
    {
        "_id": "663e04f27d4e5cfffb507dc9",
        "name": "contact-name-2",
        "email": "contact_email_2@222.com",
        "phone": "(333) 333-3333",
        "favorite": false,
        "owner": "663dfc92d17127853e1b3d8a",
        "createdAt": "2024-05-10T11:28:50.860Z",
        "updatedAt": "2024-05-10T11:28:50.860Z"
    }
]