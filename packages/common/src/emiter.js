export class Emiter{
    constructor(worker){
         this.suscriptions =  new Map();         
         this.worker = worker;
         this.worker.onmessage = ({data})=>{
            const {type,...rest} = data;
            this.emit(type,{rest})
         };
    }
    on(type,cb){
        let suscriptors = this.suscriptions.get(type)
        if (!suscriptors){
            suscriptors=[]
        }
        suscriptors.push(cb)    
        this.suscriptions.set(type,suscriptors)
    }
    emit(type,data){
        if(this.worker){
            this.worker.postMessage({type,...data})
        }else{
            const suscriptors = this.suscriptions.get(type)
            if(suscriptors){
                suscriptors.forEach(s({type,...data}))
            }           
        }
    }
    dispose(){
        if(this.worker){
            this.worker.onmessage = null;
        }
        this.suscriptions=new Map();
    }
}