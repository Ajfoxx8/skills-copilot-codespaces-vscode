const STORAGE_KEY = 'tabmaster_songs';

const parseSongs = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to parse songs from storage', error);
    return [];
  }
};

const persistSongs = (songs) => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
};

export function listSongs() {
  return parseSongs();
}

export function getSong(id) {
  return parseSongs().find((song) => song.id === id);
}

export function upsertSong(song) {
  const songs = parseSongs();
  const existingIndex = songs.findIndex((item) => item.id === song.id);
  if (existingIndex >= 0) {
    songs[existingIndex] = song;
  } else {
    songs.unshift(song);
  }
  persistSongs(songs);
  return song;
}

export function removeSong(id) {
  const songs = parseSongs().filter((song) => song.id !== id);
  persistSongs(songs);
}

export function wipeSongs() {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}
