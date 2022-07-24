import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IAnime {
  title: String;
  kayoDriveUrl?: String;
  gogoUrl?: String;
  lastChecked?: String;
  episodeCount?: Number;
}

const AnimeSchema = new Schema<IAnime>({
  title: { type: String, required: true },
  kayoDriveUrl: String,
  gogoUrl: String,
  lastChecked: String,
  episodeCount: Number,
});

export default mongoose.model('Anime', AnimeSchema);
