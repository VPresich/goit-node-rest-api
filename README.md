# Домашнє завдання 2

REST API для роботи з колекцією контактів. Для роботи з REST API використовуй [Postman] (https://www.getpostman.com/).

REST API повинен підтримувати такі routs:

### @ GET /api/contacts

- Викликає функцію-сервіс `listContacts` для роботи з json-файлом `contacts.json`
- Повертає масив всіх контактів в json-форматі зі статусом `200`

### @ GET /api/contacts/:id

- Викликає функцію-сервіс `getContactById` для роботи з json-файлом `contacts.json`
- Якщо контакт за `id` знайдений, повертає об'єкт контакту в json-форматі зі статусом `200`
- Якщо контакт за `id` не знайдено, повертає json формату `{"message": "Not found"}` зі статусом `404`

### @ DELETE /api/contacts/:id

- Викликає функцію-сервіс `removeContact` для роботи з json-файлом `contacts.json`
- Якщо контакт за `id` знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом `200`
- Якщо контакт за `id` не знайдено, повертає json формату `{"message": "Not found"}` зі статусом `404`

### @ POST /api/contacts

- Отримує `body` в json-форматі з полями `{name, email, phone}`. Усі поля є обов'язковими - для валідації створи у файлі `contactsSchemas.js` (знаходиться у папці `schemas`) схему з використаням пакета `joi`
- Якщо в `body` немає якихось обов'язкових полів (або передані поля мають не валідне значення), повертає json формату `{"message": error.message}` (де `error.message` - змістовне повідомлення з суттю помилки) зі статусом `400`
- Якщо `body` валідне, викликає функцію-сервіс `addContact` для роботи з json-файлом `contacts.json`, з передачею їй даних з `body`
- За результатом роботи функції повертає новостворений об'єкт з полями `{id, name, email, phone}` і статусом `201`

### @ PUT /api/contacts/:id

- Отримує `body` в json-форматі з будь-яким набором оновлених полів (`name`, `email`, `phone`) (всі поля вимагати в боді як обов'язкові не потрібно: якщо якесь із полів не передане, воно має зберегтись у контакта зі значенням, яке було до оновлення)
- Якщо запит на оновлення здійснено без передачі в `body` хоча б одного поля, повертає json формату `{"message": "Body must have at least one field"}` зі статусом `400`.
- Передані в боді поля мають бути провалідовані - для валідації створи у файлі `contactsSchemas.js` (знаходиться у папці `schemas`) схему з використанням пакета `joi`. Якщо передані поля мають не валідне значення, повертає json формату `{"message": error.message}` (де `error.message` - змістовне повідомлення з суттю помилки) зі статусом `400`
- Якщо з `body` все добре, викликає функцію-сервіс `updateContact`, яку слід створити в файлі `contactsServices.js` (знаходиться в папці `services`). Ця функція має приймати `id` контакта, що підлягає оновленню, та дані з `body`, і оновити контакт у json-файлі `contacts.json`
- За результатом роботи функції повертає оновлений об'єкт контакту зі статусом `200`.
- Якщо контакт за `id` не знайдено, повертає json формату `{"message": "Not found"}` зі статусом `404`

### Зверни увагу

- Валідацію `body` можна як здійснювати у контролері, так і створити для цих цілей окрему міддлвару, яка буде викликатись до контролера. Для створення міддлвари можеш скористатись функцією `validateBody.js`, яку знайдеш у папці `helpers`
- Для роботи з помилками можна скористатись функцією `HttpError.js`, яку знайдеш у папці `helpers`

Якщо вказані функції використовувати не будеш, видали їх з проєкту перед тим, як надсилатимеш роботу на перевірку ментору


For testing:

GET (listContacts)
http://localhost:3000/api/contacts 

GET (getContactById)
http://localhost:3000/api/contacts/qdggE76Jtbfd9eWJHrssH 

DELETE (removeContact)
http://localhost:3000/api/contacts/qdggE76Jtbfd9eWJHrssH

POST (addContact)
http://localhost:3000/api/contacts
body
{
    "name": "Chaim Lewis",
    "email": "dui.in@egetlacus.ca",
    "phone": "(294) 840-6685"
}

PUT (updateContactById)
http://localhost:3000/api/contacts/qdggE76Jtbfd9eWJHrssH (id - change)
body
{
    "name": "Chaim Lewis",
    "email": "dui.in@egetlacus.ca",
    "phone": "(294) 840-6685"
}
OR (with )
{  
    "email": "qqq@egetlacus.ca",
    "phone": "(294) 111111"
}

netstat -ano | findstr :3000 - подивитися список портів
taskkill /F /PID 24944 - kill process