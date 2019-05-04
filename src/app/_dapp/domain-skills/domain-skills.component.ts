import { Component, OnInit } from '@angular/core';
import { DomainsSkillsService, StateService } from '../../services/services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MethodInstance } from '../../models/method';

@Component({
  selector: 'app-domain-skills',
  templateUrl: './domain-skills.component.html'
})
export class DomainSkillsComponent implements OnInit {
  private state: Array<any> = [];
  public methods;
  public methodSelected: MethodInstance;
  public result : any;

  model = {
    domain: {id: null, localSkillId: null, potId: null},
    skill: {id: null, parentSkillId: null, nParents: null, nChildren: null, isGlobalSkill: false}
  };

  domainForm = new FormGroup({
    0: new FormControl('', Validators.required),
    1: new FormControl('', Validators.required)
  });

  constructor(private dss: DomainsSkillsService, private ss: StateService) { }

  ngOnInit() {
    this.state = this.ss.getState();
    this.ss.stateObservable.subscribe((state) => {
      this.state = this.ss.getState();
    });
    this.methods = this.dss.getMethods();
    console.log(this.methods);
  }

  addDomain(parentDomainId) {
    this.dss.addDomain(
      this.state[1],          // colonyClient
      Number(parentDomainId)          // 1
    ).then(res => {
      console.log(res);
      this.result = res;
      this.model.domain = res;
      // this.addGlobalSkill();
    }).catch( err => {
      console.error(err);
    });
  }

  getDomain(domainId) {
    this.dss.getDomain(
      this.state[1],          // colonyClient
      Number(domainId)          
    ).then(res => {
      this.result = res;
      this.model.domain = res;
    }).catch( err => {
      console.error(err);
    });
  }

  getDomainCount() {
    this.dss.getDomainCount(
      this.state[1],          // colonyClient      
    ).then(res => {
      this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  getSkill(skillId) {
    this.dss.getSkill(
      this.state[0],          // networkClient
      Number(skillId)          
    ).then(res => {
      this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  getSkillCount() {
    this.dss.getSkillCount(
      this.state[0],          // networkClient       
    ).then(res => {
      this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  addSkill(parentSkillId, isGlobal) {
    this.dss.addSkill(
      this.state[0],         // networkClient
      Number(parentSkillId),                     
      Boolean(isGlobal)
    ).then(res => {
      this.result = res;
    });
  }

  getParentSkillId(skillId, skillIndex) {
    this.dss.getParentSkillId(
      this.state[0],         // networkClient
      Number(skillId),                      
      Number(skillIndex)
    ).then(res => {
      this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  onMethodSelected(index) {
    this.methodSelected = this.methods[index];
    console.log(this.methodSelected);
  }

  executeMethod(method) {
    console.log(method);
    switch (method) {
        case "addDomain":
            this.addDomain(this.domainForm.get('0').value);
            break;
        case "getDomain":
            this.getDomain(this.domainForm.get('0').value);
            break;
        case "getDomainCount":
            this.getDomainCount();
            break;
        case "getSkill":
            this.getSkill(this.domainForm.get('0').value);
            break;
        case "getSkillCount":
            this.getSkillCount();
            break;
        case "addSkill":
            this.addSkill(this.domainForm.get('0').value, this.domainForm.get('1').value);
            break;
        case "getParentSkillId":
            this.getParentSkillId(this.domainForm.get('0').value, this.domainForm.get('1').value);
            break;
        default:
            break;
    }
    this.domainForm.reset();
  }
}
