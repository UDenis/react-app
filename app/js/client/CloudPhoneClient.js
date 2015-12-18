import VoxImplant from './voximplant'
import Call from './Call'
import {EventEmitter} from 'Emitter'

const voxImplant = VoxImplant.getInstance();
let cloudPhoneClient;
let selfCreating = false;

export default class CloudPhoneClient extends EventEmitter {
	static Events = {
		AuthResult: VoxImplant.Events.AuthResult,

		ConnectionClosed: VoxImplant.Events.ConnectionClosed,
		ConnectionEstablished: VoxImplant.Events.ConnectionEstablished,
		ConnectionFailed: VoxImplant.Events.ConnectionFailed,
		Connecting: 'Client.Connecting',

		IMError: VoxImplant.Events.IMError,
		IncomingCall: VoxImplant.Events.IncomingCall,
		MicAccessResult: VoxImplant.Events.MicAccessResult,
		NetStatsReceived: VoxImplant.Events.NetStatsReceived,
		PlaybackFinished: VoxImplant.Events.PlaybackFinished,
		SDKReady: VoxImplant.Events.SDKReady,
		SourcesInfoUpdated: VoxImplant.Events.SourcesInfoUpdated,
		Destroyed: 'Client.Destroyed'
	}

	constructor(options) {
		super();

		this.options = options;
		this.phoneNumberNormalizer = this.options.normalizePhoneNumber || ((p)=>p);

	}

	call({phone}) {
		return new Call(voxImplant.call(this.normalizePhoneNumber(phone)));
	}

	normalizePhoneNumber(phone){
		return this.phoneNumberNormalizer(phone)
	}

	init(options) {
		this.options = options;

		const unsubscribers = [];

		Object
			.keys(VoxImplant.Events)
			.forEach((key)=> {
				const self = this;
				const event = VoxImplant.Events[key];

				voxImplant.addEventListener(event, proxyHandler);

				unsubscribers.push(()=> {
					voxImplant.removeEventListener(event, proxyHandler);
				});

				function proxyHandler(ev) {
					self.emit(CloudPhoneClient.Events[key], ev);
				}
			});

		this.once(CloudPhoneClient.Events.Destroyed, ()=> {
			unsubscribers.forEach(unsubscriber=>unsubscriber());
			unsubscribers.length = 0;
		});

		voxImplant.init(options);
	}

	destroy(){
		this.emit(CloudPhoneClient.Events.Destroyed);
		this.removeAllListeners();
	}

	connect(){
		this.emit(CloudPhoneClient.Events.Connecting);
		voxImplant.connect();
	}

	login({login, password, options}) {
		voxImplant.login(`${login}@${this.options.appName}.${this.options.accName}.voximplant.com`, password, options);
	}
}
