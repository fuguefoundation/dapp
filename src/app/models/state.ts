export class State {

    network: {
        address: string;
        provider: string;
        signerAddr: string;
    };
    token: {
        address: string;
        owner: string;
        name: string;
        symbol: string;
        decimals: number;
        minted: number;
        totalSupply: number;
        potBalance: number;
        toPotBalanceAfter: number;
        userBalance: number;
    };
    colony: {
        id: number;
        address: string;
        hasUserRole: boolean;
    };
    domain: {
        id: number;
        localSkillId: number;
        potId: number;
    };
    skill: {
        id: number;
        parentSkillId: number;
        nParents: number;
        nChildren: number;
        isGlobalSkill: boolean;
    };
    task: {
        title: string;
        description: string;
        completionDate: string;
        deliverableHash: string;
        domainId: number;
        dueDate: Date;
        id: number;
        payoutsWeCannotMake: number;
        potId: number;
        specificationHash: string;
        status: string;
        sign: {
            signSetTaskSkill: boolean;
            signSetTaskDueDate: boolean;
            signRemoveTaskEvaluatorRole: boolean;
            signSetTaskEvaluatorRole: boolean;
            signSetTaskWorkerRole: boolean;
            signSetTaskBrief: boolean;
        };
        payout: {
            manager: number;
            evaluator: number;
            worker: number;
        };
        submit: {

        }
    }

}
