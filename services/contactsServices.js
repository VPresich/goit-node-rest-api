import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function writeContacts(contacts) {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  const removedContact = contacts.splice(index, 1)[0];
  await writeContacts(contacts);
  return removedContact;
}

async function addContact(contact) {
  const newContact = { id: crypto.randomUUID(), ...contact };
  const contacts = await listContacts();
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateContactById(id, contactData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;

  const updatedContact = { ...contacts[index], ...contactData };

  contacts[index] = updatedContact;
  await writeContacts(contacts);
  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
