export class Emiter{
    constructor(worker){
         this.suscriptions =  new Map();         
         this.worker = worker;
         this.worker.onmessage = ({data})=>{
            const {type,...rest} = data;
            this.#notify(type,rest)
         };
    }
    #notify(type,data){    
        const suscriptors = this.suscriptions.get(type)
        if(suscriptors){
            suscriptors.forEach(s=>s(data))
        }         
    
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
        this.worker.postMessage({type,...data})        
    }
    dispose(){
        if(this.worker){
            this.worker.onmessage = null;
        }
        this.suscriptions=new Map();
    }
}