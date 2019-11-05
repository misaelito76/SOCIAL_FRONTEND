import { PipeTransform, Pipe, Input } from '@angular/core';

@Pipe({
    name:'summary'
})

export class SummaryPipe implements PipeTransform{
    @Input() summary

    finalValue:string;
    transform(value:string , limit?:number){
if(value){
    let actualLimit = (limit)? limit:90
         this.finalValue= value.substr(0, actualLimit)  + `...`;
 
   return this.finalValue

}
	
}
    }
    
   

  