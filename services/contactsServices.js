import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function writeContacts(contacts) {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index !== -1) {
      const removedContact = contacts.splice(index, 1)[0];
      await writeContacts(contacts);
      return removedContact;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function addContact(contact) {
  try {
    const newContact = { id: crypto.randomUUID(), ...contact };
    const contacts = await listContacts();
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
  } catch (error) {
    return null;
  }
}

async function updateContact(id, contactData) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index !== -1) {
      const updatedContact = { id, ...contactData };
      contacts[index] = updatedContact;
      await writeContacts(contacts);
      return updatedContact;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
