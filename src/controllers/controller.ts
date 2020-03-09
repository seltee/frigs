import Event from './utils/event';

type Callback = (type: Event) => void;

export default abstract class Controller {
    private _subscriptions: Array<Callback> = [];

    public subscribe(callback: Callback){
        this.unSubscribe(callback);
        this._subscriptions.push(callback);
    }

    public unSubscribe(callback: Callback){
        this._subscriptions = this._subscriptions.filter(item => item != callback);
    }

    protected notify(type: Event){
        this._subscriptions.forEach(sub => sub(type));
    }
};
