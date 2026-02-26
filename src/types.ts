export interface Song {
    name: string;
    type: string;
    imagePath: string;
}

export interface Chart {
    id: string;
    type: string;
    shorthand: string;
    level: number;
    song: Song;
}

 