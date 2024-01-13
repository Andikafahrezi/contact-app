const { lookup } = require("node:dns");
const fs = require("node:fs");

//create data folder
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

//create file json in folder data
const dataPath = "./data/contact.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

//retrieve all data in json
const loadContact = () => {
  const file = fs.readFileSync("data/contact.json", "utf-8");
  const kontaks = JSON.parse(file);
  return kontaks;
};

//search for contacts by name
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

//write the contact.json file with the new data
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};

//create new contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// check for duplicate contact names
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

//funtion delete kontak
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

//function update contact
const updateContacts = (contactNew) => {
  const contacts = loadContact();
  //remove old contacts whose names are the same as oldname
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== contactNew.oldnama
  );
  delete contactNew.oldnama;
  filteredContacts.push(contactNew);
  saveContacts(filteredContacts);
};

// exporting
module.exports = {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
};
