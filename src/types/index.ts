// export type TODO = any;

export interface Entity
{
  id: number
  text?:string;
  value?:number;
}

export interface Category extends Entity {
  // id:  number;
  categoryName: string;
  parentId: string;

}

export interface UserInfo extends Entity {
  messages: string[],
  notifications: string[],
  tasks: string[]
}

export interface User extends Entity {
    
      // id : string;
      firstName : string;
      lastName : string;
      email : string;
      avatar : string;
      mobile : string;
      homephone : string;
      workphone : string;
    }

  
  export interface Customer extends User {
      membership: boolean;
      rewards : 0;
      orders: string[];
      orderAmount: number;
    }
  
  
  

  export interface Address extends Entity {
    address: string;
    city: string;
    zipcode: string;
    country: string;
  }

  export interface Order extends Entity {
    
      // id : string;
      reference : string;
      customerId : string;
      customer : Customer;
      products : Product[];
      amount: number;
      orderDate :string;
      shippedDate : string;
      shipAddress : Address;
    }
    


  export interface Product extends Entity {
      // id : string;
      productName : string;
      categoryId : string;
      unitInStock : string;
      unitPrice : number;
      category : Category;
      categoryName?: string;


  }
  

  export interface State extends Entity {
    items: TODO[];
    pagination: TODO;
    loading: boolean;
    mode: string ;
    snackbar: boolean;
        notice: string;
    customer: Customer;
    orders: Order[];
    orderList: Order[];
  };