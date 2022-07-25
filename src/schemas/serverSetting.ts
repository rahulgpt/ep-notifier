import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IServerSettings {
  serverId: string;
  prefix: string;
  updateChannel: string;
  addAnimeRole: string;
  owner: string;
}

const ServerSettingSchema = new Schema<IServerSettings>({
  serverId: { type: String, required: true },
  prefix: String,
});

export default mongoose.model<IServerSettings>(
  'ServerSetting',
  ServerSettingSchema
);
