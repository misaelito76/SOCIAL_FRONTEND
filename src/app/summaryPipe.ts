import { PipeTransform, Pipe, Input } from '@angular/core';

@Pipe({
    name: 'summary',

})

export class SummaryPipe implements PipeTransform{
    @Input() 'summary'

    finalValue: string;
    finalValue1:number;

    transform(value:string , limit?:number){
if(value){
    let actualLimit = (limit)? limit:90
    this.finalValue = value.substr(0, actualLimit) + `...`;
    this.finalValue1 =value.length

    return this.finalValue

} 
return this.finalValue1


    }

    
    }
    
   

  