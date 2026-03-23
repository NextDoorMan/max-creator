const DB_NAME = 'PortfolioAssetCache';
const DB_VERSION = 1;
const STORE_NAME = 'assets';

interface CachedAsset {
  url: string;
  blob: Blob;
  type: 'image' | 'audio';
  timestamp: number;
}

class PersistentAssetCache {
  private db: IDBDatabase | null = null;
  private memoryCache: Map<string, string> = new Map();
  private blobCache: Map<string, Blob> = new Map();
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initDB();
    this.setupMaintenanceInterval();
  }

  private setupMaintenanceInterval(): void {
    setInterval(() => {
      this.refreshExpiredBlobUrls();
    }, 5 * 60 * 1000);
  }

  private refreshExpiredBlobUrls(): void {
    this.memoryCache.forEach((blobUrl, url) => {
      const blob = this.blobCache.get(url);
      if (blob) {
        try {
          URL.revokeObjectURL(blobUrl);
          const newBlobUrl = URL.createObjectURL(blob);
          this.memoryCache.set(url, newBlobUrl);
        } catch (error) {
          console.warn(`Failed to refresh blob URL for ${url}:`, error);
        }
      }
    });
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    await this.initPromise;
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  async cacheAsset(url: string, type: 'image' | 'audio'): Promise<string> {
    if (this.memoryCache.has(url)) {
      const cachedUrl = this.memoryCache.get(url)!;
      try {
        await fetch(cachedUrl, { method: 'HEAD' });
        return cachedUrl;
      } catch {
        this.memoryCache.delete(url);
      }
    }

    try {
      const db = await this.ensureDB();
      const cachedAsset = await this.getFromIndexedDB(db, url);

      if (cachedAsset) {
        const objectUrl = URL.createObjectURL(cachedAsset.blob);
        this.memoryCache.set(url, objectUrl);
        this.blobCache.set(url, cachedAsset.blob);
        return objectUrl;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const blob = await response.blob();
      const asset: CachedAsset = {
        url,
        blob,
        type,
        timestamp: Date.now()
      };

      await this.saveToIndexedDB(db, asset);

      const objectUrl = URL.createObjectURL(blob);
      this.memoryCache.set(url, objectUrl);
      this.blobCache.set(url, blob);

      return objectUrl;
    } catch (error) {
      console.error(`Failed to cache asset ${url}:`, error);
      return url;
    }
  }

  private getFromIndexedDB(db: IDBDatabase, url: string): Promise<CachedAsset | null> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private saveToIndexedDB(db: IDBDatabase, asset: CachedAsset): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(asset);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async preloadAssets(urls: string[], type: 'image' | 'audio'): Promise<void> {
    const promises = urls.map(url => this.cacheAsset(url, type));
    await Promise.allSettled(promises);
  }

  getCachedUrl(url: string): string | null {
    return this.memoryCache.get(url) || null;
  }

  async clearCache(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        this.memoryCache.clear();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const assetCache = new PersistentAssetCache();

export const IMAGE_ASSETS = [
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/city_final_upd_wygefa.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491171/game_logo_yex451.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/road_newest_wbc37l.png',
  '/assets/S7_chairs.jpg',
  '/assets/S7_cinema.jpg',
  '/assets/S7_top.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490268/S7_%D1%80%D0%B5%D0%B9%D1%81_2_1_mkkp3q.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_3_cn2vny.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_new_teh76k.png',
  '/assets/SMMарио_mini.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png',
  '/assets/Авито_артек_2.jpg',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490409/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%B0%D1%80%D1%82%D0%B5%D0%BA_3_hvgdwl.jpg',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490408/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%B0%D1%80%D1%82%D0%B5%D0%BA_4_nt0wd9.jpg',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490409/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%90%D1%80%D1%82%D0%B5%D0%BA_ib0viq.jpg',
  '/assets/Брендиньо_миниатюра.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png',
  '/assets/город.png',
  '/assets/Мудборя_mini.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490597/%D0%A4%D0%BE%D0%BD_nllusy.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/about_icon_fi3b5s.png',
  '/assets/about/хобби_игры_(1).png',
  '/assets/about/хобби_муаи_таи_(1).png',
  '/assets/about/хобби_пианино_(1).png',
  '/assets/about/хобби_сноуборд_(1).png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/contacts_icon_pgy4ei.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490813/resume_icon_sdpmqk.png',
  '/assets/cv/резюме_1.png',
  '/assets/cv/резюме_2.png',
  '/assets/cv/резюме_3.png',
  '/assets/cv/резюме_4.png',
  '/assets/cv/резюме_5.png',
  '/assets/cv/резюме_6.png',
  '/assets/cv/резюме_7.png',
  '/assets/cv/резюме_8.png',
  '/assets/cv/резюме_9.png',
  '/assets/gallery/Flash_UP_cover.png',
  '/assets/gallery/Holsten_cover.png',
  '/assets/gallery/Lavina_cover.png',
  '/assets/gallery/LPS_cover.png',
  '/assets/gallery/NERF_cover.png',
  '/assets/gallery/S7_Priority_cover.png',
  '/assets/gallery/Transformers_cover.png',
  '/assets/gallery/Zatecky_Gus_cover.png',
  '/assets/gallery/Артек_cover.png',
  '/assets/gallery/Ясно_солнышко_cover.png',
  '/assets/icons/5lakes.png',
  '/assets/icons/Avito.png',
  '/assets/icons/Flash_Up.png',
  '/assets/icons/Holsten.png',
  '/assets/icons/Lavina.png',
  '/assets/icons/Littlest_Pet_Shop.png',
  '/assets/icons/NERF.png',
  '/assets/icons/Nutrilite.png',
  '/assets/icons/S7_Flight.png',
  '/assets/icons/S7_Priority.png',
  '/assets/icons/Transformers.png',
  '/assets/icons/Zatecky_Gus.png',
  '/assets/icons/Артек.png',
  '/assets/icons/ВТБ.png',
  '/assets/icons/Ясно_Солнышко.png',
  '/Балтика.png'
];

export const AUDIO_ASSETS = [
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488779/Game_Over_bpawbn.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/hero_selection_loud_bdty1t.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_2_dk0hen.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_3_bcvpkx.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_qck2gt.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B7%D0%B2%D1%83%D0%BA_%D1%84%D0%B0%D0%BA%D1%82%D0%B0_n1qwe2.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488771/%D0%9E%D1%82%D1%81%D1%87%D0%B5%D1%82_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0_odewjy.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488774/%D0%BF%D1%80%D1%8B%D0%B6%D0%BE%D0%BA_juaj6a.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3'
];
