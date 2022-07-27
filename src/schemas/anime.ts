import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IAnime {
  title: string;
  kayoDriveUrl: string;
  gogoUrl?: string;
  lastChecked?: string;
  episodeCount?: number;
  schedule: boolean;
  fullTitle: string;
  image: string;
}

const AnimeSchema = new Schema<IAnime>({
  title: { type: String, required: true },
  kayoDriveUrl: { type: String, required: true },
  gogoUrl: String,
  lastChecked: String,
  episodeCount: Number,
  schedule: { type: Boolean, default: true },
  fullTitle: String,
  image: String,
});

export default mongoose.model<IAnime>('Anime', AnimeSchema);
