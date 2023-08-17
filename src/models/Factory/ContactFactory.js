import ContactModel from '../Operations/Contact.js'
const contact = new ContactModel()

class Contact {
  static async totalItems () {
    return await contact.totalItems()
  }

  static async getContacts (options) {
    return await contact.getContacts(options)
  }

  static async getContact (id) {
    return await contact.getContact(id)
  }

  static async getUnsentContacts () {
    return await contact.getUnsentContacts()
  }

  static async createContact (body) {
    return await contact.createContact(body)
  }

  static async updateContact (body) {
    return await contact.updateContact(body)
  }

  static async deleteContact (body) {
    return await contact.deleteContact(body)
  }
}

export default Contact
