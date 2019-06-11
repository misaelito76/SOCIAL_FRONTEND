export class User{
    constructor(
        public _id: string,
        public name:string,
        public surname:string,
        public email:string,
        public password:string,
        public role: string,
        public image: string,
        public nick?: string,
        public petName?:string,
        public age?:string,
        public animal?:string,
        public race?:string,
        public sex?: string,
        public allergies?: string,
        public meals?: string,
        public address?: string,
        public mobile?:string,
        public vaccination?: string,
        public licensing?: string,
        public status?:string,
        public comments?:string
       
 

    ){}
}