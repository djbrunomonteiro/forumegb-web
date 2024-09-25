export interface IPost {
    id?: number;
    title?: string;
    body?: string;
    music_preview?: string;
    source_url?: string | null;
    thumbnail?: string;
    slug?: string;
    owner_id: number;
    owner_username: string;
    metadata?: string;
    status?: string;
    parent_id?: number | null;
    children?: IPost[];
    created_at?: string;
    updated_at?: string;

}