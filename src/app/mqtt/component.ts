
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Packet } from 'mqtt';

import { MQTTService } from 'app/mqtt/service';
import { ConfigService } from 'app/services/config/config.service';

@Component({
    selector: 'mqtt-message',
    templateUrl: './template.html',
    styleUrls: ['./index.scss'],
    providers: [MQTTService, ConfigService]
})
export class MqttComponent implements OnInit, OnDestroy {

    // Stream of messages
    public messages: Observable<Packet>;

    // Array of historic message (bodies)
    public mq: Array<string> = [];

    // A count of messages received
    public count = 0;

    /** Constructor */
    constructor(private _mqService: MQTTService,
        private _configService: ConfigService) { }

    ngOnInit() {
        // Get configuration from config service...
        this._configService.getConfig('settings/mqtt-login.json').then(
            config => {
                // ... then pass it to (and connect) the message queue:
                this._mqService.configure(config);
                this._mqService.try_connect()
                    .then(this.on_connect)
                    .catch(this.on_error);
            }
        );
    }

    ngOnDestroy() {
        this._mqService.disconnect();
    }

    /** Callback on_connect to queue */
    public on_connect = () => {

        // Store local reference to Observable
        // for use with template ( | async )
        this.messages = this._mqService.messages;
        // Subscribe a function to be run on_next message
        this.messages.subscribe(this.on_next);
    }

    /** Consume a message from the _mqService */
    public on_next = (message: Packet) => {

        // Store message in "historic messages" queue
        this.mq.push(message.toString());

        // Count it
        console.info(this.mq);
        this.count++;
    }

    public on_error = () => {
        console.error('Ooops, error in RawDataComponent');
    }
}
