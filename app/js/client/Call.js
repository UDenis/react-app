import VoxImplant from './voximplant'
import {EventEmitter} from 'Emitter'

export default class Call extends EventEmitter {

	static Events = {
		Connected: VoxImplant.CallEvents.Connected,
		Disconnected: VoxImplant.CallEvents.Disconnected,
		Failed: VoxImplant.CallEvents.Failed,
		InfoReceived: VoxImplant.CallEvents.InfoReceived,
		MessageReceived: VoxImplant.CallEvents.MessageReceived,
		ProgressToneStart: VoxImplant.CallEvents.ProgressToneStart,
		ProgressToneStop: VoxImplant.CallEvents.ProgressToneStop,
		TransferComplete: VoxImplant.CallEvents.TransferComplete,
		TransferFailed: VoxImplant.CallEvents.TransferFailed,
		Destroyed: 'Call.Destroyed'
	}

	constructor(voximplantCall) {
		super();

		this.voximplantCall = voximplantCall;

		const unsubscribers = [];

		Object
			.keys(VoxImplant.CallEvents)
			.forEach((key)=> {
				const self = this;
				const event = VoxImplant.CallEvents[key];

				this.voximplantCall.addEventListener(event, proxyHandler);

				unsubscribers.push(()=> {
					this.voximplantCall.removeEventListener(event, proxyHandler);
				});

				function proxyHandler(ev) {
					self.emit(Call.Events[key], ev);
				}
			});

		this.once(Call.Events.Destroyed, ()=> {
			unsubscribers.forEach(unsubscriber=>unsubscriber());
			unsubscribers.length = 0;
		});

		const destroyableEvents = [VoxImplant.CallEvents.Disconnected,  VoxImplant.CallEvents.Failed];
		destroyableEvents.forEach(event => {
			this.addListener(event, this.destroy.bind(this));
		});
	}

	destroy() {
		this.emit(Call.Events.Destroyed);
		this.removeAllListeners();
	}
}