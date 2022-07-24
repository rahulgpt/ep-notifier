import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IServerSettings {
  serverId: string;
  prefix: string;
}

const ServerSettingSchema = new Schema<IServerSettings>({
  serverId: { type: String, required: true },
  prefix: String,
});

export default mongoose.model('ServerSetting', ServerSettingSchema);
