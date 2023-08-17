import AgentModel from '../Operations/Agent.js'
const agent = new AgentModel()

class Agent {
  static async totalItems () {
    return await agent.totalItems()
  }

  static async getAgents (options) {
    return await agent.getAgents(options)
  }

  static async getActiveAgents () {
    return await agent.getActiveAgents()
  }

  static async getAgent (id) {
    return await agent.getAgent(id)
  }

  static async createAgent (body) {
    return await agent.createAgent(body)
  }

  static async updateAgent (body) {
    return await agent.updateAgent(body)
  }

  static async deleteAgent (body) {
    return await agent.deleteAgent(body)
  }

  // static async sendContacts (body) {
  //   return await agent.sendContacts(body)
  // }
}

export default Agent
