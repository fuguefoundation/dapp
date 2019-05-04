import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StateService, NetworkClientService } from '../services/services';

@Component({
  selector: 'app-colony',
  templateUrl: './colony-home.component.html',
  styleUrls: ['./colony-home.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class ColonyHomeComponent implements OnInit {

    cSelected: string;
    showComponents: boolean = false;

    sections = [
        {
            name: 'Network',
            id: 'network',
            icon: 'network_check',
            color: 'gradient-purple'
        },
        {
            name: 'Colony',
            id: 'colony',
            icon: 'people',
            color: 'gradient-blue'            
        },        
        {
            name: 'Tokens and Funding',
            id: 'token',
            icon: 'list_alt',
            color: 'gradient-indigo'            
        },
        {
            name: 'Domains and Skills',
            id: 'domain',
            icon: 'domain',
            color: 'gradient-green'
        },
        {
            name: 'Tasks',
            id: 'task',
            icon: 'group_work',
            color: 'gradient-pink'
        }
    ];

  constructor(private ss: StateService, private ncs: NetworkClientService) { 
    
  }

  ngOnInit() {
    this.ss.componentSelectionObservable.subscribe((section) => {
        this.cSelected = section;
    });
  }

  onSectionSelected(section){
    console.log(section);
    this.ss.updateComponentSelection(section);
  }

  connectNetworkRinkeby(choice) {
    let networkClient;
    switch (choice) {
        case 'trezor':
            this.ncs.connectNetworkRinkeby(choice).then(res => {
                this.ss.updateState(res);
                networkClient = res;
                this.showComponents = true;
            });               
            break;
        case 'metamask':
            this.ncs.blockNative().then((result) => {
                if (result) {
                    this.ncs.connectNetworkRinkeby(choice).then(res => {
                        this.ss.updateState(res);
                        this.ss.updateMaster(['network', {address: res._contract.address, provider: res._contract.provider.name, signerAddr: res._contract.signer.wallet.address}]);
                        networkClient = res;
                        this.showComponents = true;
                    });        
                }
            });
            break;
    
        default:
            break;
    }
    // this.model.networkAddr = res._contract.address;
    // this.model.networkProvider = res._contract.provider.name;
    // this.model.networkSignerAddr = res._contract.signer.wallet.address;

  }
}
