import { Component } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { SharedService } from 'src/app/services/shared.service';

export interface Challenge {
  name?: string;
  goal?: number;
  private?: boolean;
  startDate?: string;
  endDate?: string;
  deep?: boolean;
  type?: number;
}

export interface ActivityType {
  id: number;
  type: string;
}

export interface DeepHeight {
  id: boolean;
  type: string;
}

export interface Privacy {
  id: boolean;
  type: string;
}

@Component({
  selector: 'app-management-challenges',
  templateUrl: './management-challenges.component.html',
  styleUrls: ['./management-challenges.component.scss'],
  providers: [MessageService]
})
export class ManagementChallengesComponent {
  //productDialog: boolean = false;
  challengeDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  newChallenge: boolean = false;

  //products: Product[] = [];
  challenges: Challenge[] = [
    {
      name: 'Challenge 1',
      goal: 5000,
      private: false,
      startDate: '11/2/2023',
      endDate: '11/3/2023',
      deep: true,
      type: 1 //runnig
    },
    {
      name: 'Challenge 2',
      goal: 1000,
      private: false,
      startDate: '11/2/2023',
      endDate: '11/3/2023',
      deep: false,
      type: 2 //cycling
    },
  ];

  activities: ActivityType[] = [
    {
      id: 1,
      type: 'Runnig'
    },
    {
      id: 2,
      type: 'Cycling'
    }
  ];

  deep_height: Object[] = [
    {
      id: true,
      type: "Deep"
    },
    {
      id: false,
      type: "Height"
    }
  ];

  privacy: Object[] = [
    {
      id: true,
      type: "Private"
    },
    {
      id: false,
      type: "Public"
    }
  ];

  //product: Product = {};
  challenge: Challenge = {};

  selectedType: ActivityType = {
    id: 0,
    type: ''
  };

  selectedPrivacy: Privacy = {
    id: false,
    type: ''
  }

  selectedDeepHeight: DeepHeight = {
    id: false,
    type: ''
  }

  selectedChallenges: Challenge[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private productService: ProductService, private messageService: MessageService, private sharedService: SharedService) { }

  ngOnInit() {
    //this.productService.getProducts().then(data => this.products = data);


    this.cols = [
      { field: 'product', header: 'Product' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
      { field: 'rating', header: 'Reviews' },
      { field: 'inventoryStatus', header: 'Status' }
    ];

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
  }

  openNew() {
    this.challenge = {};
    this.submitted = false;
    this.challengeDialog = true;
    this.newChallenge = true;
  }

  deleteSelectedChallenges() {
    this.deleteProductsDialog = true;
  }

  editProduct(challenge: Challenge) {
    this.challenge = { ...challenge };
    this.challengeDialog = true;
    this.newChallenge = false;
  }

  deleteProduct(challenge: Challenge) {
    this.deleteProductDialog = true;
    this.challenge = { ...challenge };
  }

  confirmDeleteSelected() {
    this.deleteProductsDialog = false;
    this.challenges = this.challenges.filter(val => !this.selectedChallenges.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    this.selectedChallenges = [];
  }

  confirmDelete() {
    this.deleteProductDialog = false;
    this.challenges = this.challenges.filter(val => val.name !== this.challenge.name);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    this.challenge = {};
  }

  hideDialog() {
    this.challengeDialog = false;
    this.submitted = false;
  }

  saveChallenge() {
    this.submitted = true;

    if (!this.newChallenge) {
      //validate data

      this.challenges = this.challenges.filter((challenge) => challenge.name !== this.challenge.name);
      const challengeUpdated: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: this.selectedPrivacy.id,
        startDate: this.sharedService.formatDate(this.challenge.startDate),
        endDate: this.sharedService.formatDate(this.challenge.endDate),
        deep: this.selectedDeepHeight.id,
        type: this.selectedType.id
      }
      this.challenges.push(challengeUpdated);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Updated', life: 3000 });
    }
    else {
      const createdChallenge: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: this.selectedPrivacy.id,
        startDate: this.sharedService.formatDate(this.challenge.startDate),
        endDate: this.sharedService.formatDate(this.challenge.endDate),
        deep: this.selectedDeepHeight.id,
        type: this.selectedType.id
      }
      this.challenges.push(createdChallenge);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Created', life: 3000 });
    }
    this.challengeDialog = false;
    this.challenge = {}
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getActivityType(id: number): string {
    const typeFounded = this.activities.find((type) => type.id == id);
    if (typeFounded) {
      return typeFounded.type;
    }
    return "";
  }
}
