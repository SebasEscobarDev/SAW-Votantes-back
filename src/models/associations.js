import Country from './ORM/Country.js'
import Contact from './ORM/Contact.js'
import Agent from './ORM/Agent.js'
import AgentCountry from './ORM/AgentCountry.js'
import ContactSend from './ORM/ContactSend.js'

Contact.belongsToMany(Agent, { through: ContactSend, foreignKey: 'contact_id' })
Agent.belongsToMany(Contact, { through: ContactSend, foreignKey: 'agent_id' })

Agent.belongsToMany(Country, { through: AgentCountry, foreignKey: 'agent_id' })
Country.belongsToMany(Agent, { through: AgentCountry, foreignKey: 'country_id' })
