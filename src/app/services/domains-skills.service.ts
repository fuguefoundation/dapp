import {Injectable} from '@angular/core';
import { TransactionService } from './transaction.service';

@Injectable()
export class DomainsSkillsService {

  constructor(private tx: TransactionService) {

  }

    // An example using the addDomain method
    async addDomain(colonyClient, parentDomainId) {

        // Create a new domain using the parent domain id
        const {meta} = await colonyClient.addDomain.send({ parentDomainId });
        this.tx.updateTx(meta.receipt, 'addDomain');

        // Get the total number of domains in the colony (our new domain id)
        const { count: domainId } = await colonyClient.getDomainCount.call();

        // Get the pot id of our new domain
        const domain = await colonyClient.getDomain.call({ domainId });

        // Check out the logs to see our new domain
        console.log('Domain:', {
            id: domainId,
            ...domain,
        });

        // Return our new domain
        return {
            id: domainId,
            ...domain,
        };

    }

    async addSkill(networkClient, parentSkillId, globalSkill) {

        // Add a new skill with the given parentSkillId
        const {meta} = await networkClient.addSkill.send({ parentSkillId: parentSkillId, globalSkill: globalSkill });
        this.tx.updateTx(meta.receipt, 'addSkill');

        // Get the id of the skill we just created
        const { count: skillId } = await networkClient.getSkillCount.call();

        // Get our new global skill
        const skill = await networkClient.getSkill.call({ skillId });

        // Check out the logs to see our new global skill
        console.log('Skill:', {
          id: skillId,
          parentSkillId,
          ...skill,
        });

        // Return our new global skill
        return {
          id: skillId,
          parentSkillId,
          ...skill,
        };
    }

    async getParentSkillId(networkClient, skillId, skillIndex) {
        return networkClient.getParentSkillId.call({
            skillId: skillId,
            parentSkillIndex: skillIndex
        });
    }

    async getDomain(colonyClient, domainId) {
        return colonyClient.getDomain.call({
            domainId
        });
    }

    async getDomainCount(colonyClient) {
        return colonyClient.getDomainCount.call();
    }

    async getSkill(networkClient, skillId) {
        return networkClient.getSkill.call({
            skillId
        });
    }

    async getSkillCount(networkClient) {
        return networkClient.getSkillCount.call();
    }

    getMethods() {
        return [
          {
            name: 'Add Domain',
            id: 'addDomain',
            field: [
              {
                placeholder: 'Parent Domain ID',
                validation: 'number',
                id: 'addDomainParentID'
              }
            ],
            docs: "Add a domain to the colony. Adding new domains is currently retricted to one level, i.e. the parentDomainId must be the id of the root domain 1, which represents the colony itself."
          },
          {
            name: 'Get Domain',
            id: 'getDomain',
            field: [
              {
                placeholder: 'Domain ID',
                validation: 'number',
                id: 'getDomainID'
              }
            ],
            docs: "Get information about a domain."
          },
          {
            name: 'Get Domain Count',
            id: 'getDomainCount',
            docs: "Get the total number of domains in the colony. The return value is also the ID of the last domain created."
          },
          {
            name: 'Get Skill',
            id: 'getSkill',
            field: [
              {
                placeholder: 'Skill ID',
                validation: 'number',
                id: 'getSkillID'
              }
            ],
            docs: "Get information about a skill."
          },
          {
            name: 'Get Skill Count',
            id: 'getSkillCount',
            docs: "Get the total number of global and local skills in the network."
          },
          {
            name: 'Add Skill',
            id: 'addSkill',
            field: [
              {
                placeholder: 'Parent Skill ID',
                validation: 'number',
                id: 'addSkillParentID'
              },
              {
                placeholder: 'Is Global',
                validation: 'boolean',
                id: 'addSkillIsGlobal'
              }
            ],
            docs: "Add a new global or local skill to the skills tree. Select TRUE for global, FALSE for local. Global skill can only be called from the Meta Colony and only by the user assigned the FOUNDER role."
          },
          {
            name: 'Get Parent Skill ID',
            id: 'getParentSkillId',
            field: [
              {
                placeholder: 'Skill ID',
                validation: 'number',
                id: 'getParentSkillIdSkillID'
              },
              {
                placeholder: 'Skill Index',
                validation: 'number',
                id: 'getParentSkillIdIndex'
              }
            ],
            docs: "Get the ID of a parent or child skill."
          }
        ]
    }
}
