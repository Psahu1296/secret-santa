export interface IRefs {
  [newFiles: string]: React.RefObject<HTMLInputElement>;
}

export interface IEmployees {
  Employee_Name: string;
  Employee_EmailID: string;
}

export interface IPrevEmployee extends IEmployees {
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}

export interface ISuffledEmployee {
  giver: IEmployees
  recipient: IEmployees
}