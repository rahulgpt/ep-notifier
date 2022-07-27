import { Client } from './lib';
import Browser from './lib/Browser';
import Schedular from './lib/Schedular';

const client = Client.getInstance();
client.init();
Browser.getInstance().init();
Schedular.getInstance().schedule();
