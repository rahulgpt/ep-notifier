import serverSetting, { IServerSettings } from '../schemas/serverSetting';

export default class ServerState {
  private static instance: ServerState;
  public settings: Map<string, IServerSettings> = new Map<
    string,
    IServerSettings
  >();

  private constructor() {}

  public getInstance() {
    if (!ServerState.instance) ServerState.instance = new ServerState();
    return ServerState.instance;
  }

  public async refetch(serverId: string | void) {
    let result;

    if (!serverId) {
      try {
        result = await serverSetting.find({});
        result.forEach(result => {
          this.settings.set(result.serverId, result);
        });
      } catch (e) {
        console.error(e);
      }
      return true;
    }

    try {
      result = await serverSetting.findOne({ serverId });
      if (!result) return false;
      this.settings.set(result.serverId, result);
    } catch (e) {
      console.error(e);
    }

    return true;
  }

  public getSettings(serverId: string) {
    return this.settings.get(serverId);
  }
}
